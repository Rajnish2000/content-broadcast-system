const router = require("express").Router();
const contentController = require("../controllers/content.controller");
const { verifyToken, requireRole } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// only teacher upload this
/**
 * @swagger
 * /content/upload:
 *   post:
 *     summary: Upload content (Teacher only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - subject
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               slot_id:
 *                 type: integer
 *               rotation_order:
 *                 type: integer
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Content uploaded
 */
router.post(
  "/upload",
  verifyToken,
  requireRole("teacher"),
  upload.single("file"),
  contentController.uploadContent
);

/**
 * @swagger
 * /content/all:
 *   get:
 *     summary: Get teacher's content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of content
 */
router.get(
  "/all",
  verifyToken,
  requireRole("teacher"),
  contentController.getMyContent
);

/**
 * @swagger
 * /content/pending:
 *   get:
 *     summary: Get pending content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending content
 */
router.get(
  "/pending",
  verifyToken,
  requireRole("principal"),
  contentController.getPendingContent
);

/**
 * @swagger
 * /content/{id}/approve:
 *   post:
 *     summary: Approve content (Principal only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content approved
 */
router.post(
  "/:id/approve",
  verifyToken,
  requireRole("principal"),
  contentController.approveContent
);

/**
 * @swagger
 * /content/{id}/reject:
 *   post:
 *     summary: Reject content (Principal only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content rejected
 */
router.post(
  "/:id/reject",
  verifyToken,
  requireRole("principal"),
  contentController.rejectContent
);

/**
 * @swagger
 * /content/live/{teacherId}:
 *   get:
 *     summary: Get live content for teacher
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Active content or empty response
 */
router.get("/live/:teacherId", contentController.getLiveContent);

module.exports = router;