const { Content, Schedule } = require("../models");

exports.getActiveContentForTeacher = async (teacherId, subject = null) => {
  const now = new Date();

  let contents = await Content.findAll({
    where: {
      uploaded_by: teacherId,
      status: "approved",
    },
    include: [{ model: Schedule }],
  });

  if (subject) {
    contents = contents.filter(
      (c) => c.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  const activeContents = contents.filter((c) => {
    if (!c.start_time || !c.end_time) return false;
    if (!c.Schedules || c.Schedules.length === 0) return false;

    return now >= c.start_time && now <= c.end_time;
  });

  if (activeContents.length === 0) return [];

  
  const grouped = {};

  activeContents.forEach((c) => {
    const schedule = c.Schedules[0];
    const slot = schedule.slot_id;

    if (!grouped[slot]) grouped[slot] = [];
    grouped[slot].push(c);
  });

  const result = [];

  for (let slot in grouped) {
    let items = grouped[slot];

    items.sort(
      (a, b) =>
        a.Schedules[0].rotation_order - b.Schedules[0].rotation_order
    );

    const totalDuration = items.reduce(
      (sum, item) => sum + item.Schedules[0].duration,
      0
    );

    if (totalDuration === 0) continue;

    const minutes = Math.floor(Date.now() / 60000);
    const timeSlot = minutes % totalDuration;

    let cumulative = 0;

    for (let item of items) {
      cumulative += item.Schedules[0].duration;

      if (timeSlot < cumulative) {
        result.push(item);
        break;
      }
    }
  }

  return result;
};