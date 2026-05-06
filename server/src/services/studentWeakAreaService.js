import { computeWeakAreas } from "./weakAreaService.js";
import StudentConceptRecord from "../models/StudentConceptRecord.js";

export async function getStudentWeakAreas(studentId) {
  const records = await StudentConceptRecord.find({ studentId });

  const history = (records || []).flatMap(r =>
    (r.history || []).map(h => ({
      ...(h.toObject ? h.toObject() : h),
      conceptId: r.conceptId,
      isCorrect: h.isCorrect ?? h.correct,
      at: h.at ?? h.createdAt
    }))
  );

  // const weakAreas = computeWeakAreas(history);
  return history;
}
