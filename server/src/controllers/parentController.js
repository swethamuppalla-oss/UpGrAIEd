const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const Video = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');

const getLinkedStudent = async (userId) => {
  const parent = await Parent.findOne({ user: userId });
  if (!parent) {
    return { parent: null, student: null };
  }

  const student = await Student.findOne({ parent: parent._id });
  return { parent, student };
};

const getProgrammeAndLevel = async (studentUserId) => {
  const latestProgress = await VideoProgress.findOne({ user: studentUserId })
    .sort({ updatedAt: -1 })
    .populate({
      path: 'video',
      select: 'module',
      populate: {
        path: 'module',
        select: 'level',
        populate: {
          path: 'level',
          select: 'order program',
          populate: { path: 'program', select: 'title' },
        },
      },
    });

  const currentLevel = latestProgress?.video?.module?.level?.order || 1;
  const programme = latestProgress?.video?.module?.level?.program?.title || 'Programme pending';

  return { programme, currentLevel };
};

const getChildInfo = async (req, res, next) => {
  try {
    const { student } = await getLinkedStudent(req.user.id);

    if (!student) {
      return res.status(404).json({ error: { message: 'No child linked to this parent account' } });
    }

    const [programmeInfo, totalVideos, completedVideos] = await Promise.all([
      getProgrammeAndLevel(student.user),
      Video.countDocuments({ isActive: true }),
      VideoProgress.countDocuments({ user: student.user, completed: true }),
    ]);

    const overallProgress = totalVideos > 0
      ? Math.round((completedVideos / totalVideos) * 100)
      : 0;

    res.json({
      name: student.name,
      grade: student.grade || 'Grade not assigned',
      programme: programmeInfo.programme,
      currentLevel: programmeInfo.currentLevel,
      overallProgress,
      status: completedVideos > 0 ? 'active' : 'pending',
    });
  } catch (err) {
    next(err);
  }
};

const getChildActivity = async (req, res, next) => {
  try {
    const { student } = await getLinkedStudent(req.user.id);

    if (!student) {
      return res.status(404).json({ error: { message: 'No child linked to this parent account' } });
    }

    const activity = await VideoProgress.find({ user: student.user })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({
        path: 'video',
        select: 'title module',
        populate: {
          path: 'module',
          select: 'title level',
          populate: {
            path: 'level',
            select: 'order',
          },
        },
      });

    res.json(
      activity.map((entry) => ({
        id: entry._id,
        module: entry.video?.title || entry.video?.module?.title || 'Untitled module',
        level: `Level ${entry.video?.module?.level?.order || 1}`,
        status: entry.completed ? 'completed' : 'in-progress',
        date: entry.updatedAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};

const getParentBilling = async (req, res, next) => {
  try {
    const { parent, student } = await getLinkedStudent(req.user.id);

    if (!parent) {
      return res.status(404).json({ error: { message: 'Parent profile not found' } });
    }

    const transaction = await Transaction.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    const programmeInfo = student
      ? await getProgrammeAndLevel(student.user)
      : { programme: 'Programme pending' };

    if (!transaction) {
      return res.json({
        amount: 0,
        date: null,
        status: 'pending',
        invoiceId: null,
        grade: student?.grade || 'Grade pending',
        programme: programmeInfo.programme,
      });
    }

    res.json({
      amount: transaction.amount,
      date: transaction.verifiedAt || transaction.createdAt,
      status: transaction.status === 'SUCCESS' ? 'paid' : 'pending',
      invoiceId: transaction.gatewayOrderId || String(transaction._id),
      grade: student?.grade || 'Grade pending',
      programme: programmeInfo.programme,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChildInfo,
  getChildActivity,
  getParentBilling,
};
