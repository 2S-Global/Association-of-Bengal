import type { ElectionPeriod } from "@/lib/election-timeline-validation";
import { hasElectionPeriodEnded } from "@/lib/election-timeline-validation";
import Election from "@/models/Election";
import type { ElectionStatus } from "@/types/Election";

type ElectionWithStatus = {
  _id: unknown;
  status: ElectionStatus;
  voting: ElectionPeriod;
};

/**
 * Completes only active elections whose voting period has ended. The status
 * condition in the update prevents this automatic transition from overriding
 * a concurrent manual suspension or any terminal status.
 */
export async function synchronizeElectionStatus<T extends ElectionWithStatus>(
  election: T,
): Promise<T> {
  if (election.status !== "active" || !hasElectionPeriodEnded(election.voting)) {
    return election;
  }

  const updatedElection = await Election.findOneAndUpdate(
    { _id: election._id, status: "active" },
    { $set: { status: "completed" } },
    { new: true },
  ).lean();

  if (updatedElection) return updatedElection as unknown as T;

  // A concurrent manual update may have changed the status after the read.
  // Return its current value rather than sending a stale active status.
  const currentElection = await Election.findById(election._id).lean();
  return (currentElection ?? election) as unknown as T;
}
