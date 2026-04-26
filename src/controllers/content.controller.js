const { Content, Schedule } = require("../models");
const schedulingService = require("../services/scheduling.service");
const asyncHandler = require('../utils/asyncHandlers');
const {cloudinary} = require('../utils/cloudConfig');
/**
 * TEACHER: upload Content
 */
exports.uploadContent = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      subject,
      description,
      start_time,
      end_time,
      duration,
      slot_id,
      rotation_order,
    } = req.body;

    const uploadFile = req.file;

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title and Subject are required",
      });
    }

    if (!uploadFile) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    if (!start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Start time and End time are required",
      });
    }

    const cloudUpload = await cloudinary.uploader.upload(uploadFile.path, {
      folder: "CBS_upload_images",
      public_id: `cbs_${req.user.id}`,
      unique_filename: true,
    });

    const content = await Content.create({
      title,
      subject,
      description,
      file_path: cloudUpload.secure_url,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      uploaded_by: req.user.id,
      start_time,
      end_time,
      status: "pending",
    });

    if (
    isNaN(slot_id) ||
    isNaN(rotation_order) ||
    isNaN(duration)
    ) {
    return res.status(400).json({
        success: false,
        message: "slot_id, rotation_order, duration must be numbers",
    });
    }

    if (duration && slot_id && rotation_order && content) {
      await Schedule.create({
        content_id: content.id,
        slot_id: parseInt(slot_id),
        rotation_order: parseInt(rotation_order),
        duration: parseInt(duration),
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Schedule fields required (slot_id, duration, rotation_order)",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Content uploaded and pending approval",
      data: content,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * TEACHER: View Own Content
 */
exports.getMyContent = asyncHandler(async (req, res, next) => {
  try {
    const contents = await Content.findAll({
      where: { uploaded_by: req.user.id },
      include: [{ model: Schedule }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      data: contents,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PRINCIPAL: Get Pending Content
 */
exports.getPendingContent = asyncHandler(async (req, res, next) => {
  try {
    const contents = await Content.findAll({
      where: { status: "pending" },
      include: [{ model: Schedule }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      data: contents,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PRINCIPAL: Approve Content
 */
exports.approveContent = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findByPk(parseInt(id));

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    if (content.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending content can be approved",
      });
    }

    content.status = "approved";
    content.approved_by = req.user.id;
    content.approved_at = new Date();

    await content.save();

    return res.json({
      success: true,
      message: "Content approved successfully",
      data: content,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PRINCIPAL: Reject Content
 */
exports.rejectContent = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const content = await Content.findByPk(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    if (content.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending content can be rejected",
      });
    }

    content.status = "rejected";
    content.rejection_reason = reason;

    await content.save();

    return res.json({
      success: true,
      message: "Content rejected",
      data: content,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUBLIC: Get Live Content
 */
exports.getLiveContent = asyncHandler(async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const { subject } = req.query;

    const result = await schedulingService.getActiveContentForTeacher(
      teacherId,
      subject
    );

    if (!result || result.length === 0) {
      return res.json({
        success: true,
        message: "No content available",
        data: [],
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});