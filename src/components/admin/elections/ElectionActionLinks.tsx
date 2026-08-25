import Link from "next/link";

type Props = {
  electionId: string;
  hasVotingEnded?: boolean;
  includeView?: boolean;
};

const actionClassName =
  "flex h-9 w-9 items-center justify-center rounded-lg transition";

export default function ElectionActionLinks({
  electionId,
  hasVotingEnded = false,
  includeView = false,
}: Props) {
  const nominationsHref = `/admin/manage-election/list-election/${electionId}/nominations`;

  return (
    <div className="flex items-center justify-center gap-1.5">
      {includeView && (
        <Link
          href={`/admin/manage-election/list-election/${electionId}`}
          title="View"
          className={`${actionClassName} text-gray-500 hover:bg-[#570013]/10 hover:text-[#570013] dark:hover:bg-[#570013]/20 dark:hover:text-[#e8b4b4]`}
        >
          <svg
            className="h-4.5 w-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      )}

      <Link
        href={`/admin/manage-election/list-election/${electionId}/edit`}
        title="Edit"
        className={`${actionClassName} text-gray-500 hover:bg-[#570013]/10 hover:text-[#570013] dark:hover:bg-[#570013]/20 dark:hover:text-[#e8b4b4]`}
      >
        <svg
          className="h-4.5 w-4.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </Link>

      <Link
        href={`${nominationsHref}?status=pending`}
        title="Pending nominations"
        className={`${actionClassName} text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10`}
      >
        <CandidateIcon status="pending" />
      </Link>
      <Link
        href={`${nominationsHref}?status=approved`}
        title="Approved nominations"
        className={`${actionClassName} text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10`}
      >
        <CandidateIcon status="approved" />
      </Link>
      <Link
        href={`${nominationsHref}?status=rejected`}
        title="Rejected nominations"
        className={`${actionClassName} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10`}
      >
        <CandidateIcon status="rejected" />
      </Link>

      {/* {hasVotingEnded && (
        <Link
          href={`/admin/manage-election/list-election/${electionId}/results`}
          title="Voting results"
          className={`${actionClassName} text-gray-500 hover:bg-[#570013]/10 hover:text-[#570013] dark:hover:bg-[#570013]/20 dark:hover:text-[#e8b4b4]`}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19V5" />
            <path d="M4 19h17" />
            <path d="M8 16v-5" />
            <path d="M12 16V8" />
            <path d="M16 16V4" />
            <path d="M20 16v-2" />
          </svg>
        </Link>
      )} */}

      {hasVotingEnded && (
        <button
          type="button"
          title="Voting results"
          className={`${actionClassName} text-gray-500 hover:bg-[#570013]/10 hover:text-[#570013] dark:hover:bg-[#570013]/20 dark:hover:text-[#e8b4b4]`}
          onClick={() => {
            // Result page navigation temporarily disabled.
            // Original:
            // window.location.href = `/admin/manage-election/list-election/${electionId}/results`;
          }}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19V5" />
            <path d="M4 19h17" />
            <path d="M8 16v-5" />
            <path d="M12 16V8" />
            <path d="M16 16V4" />
            <path d="M20 16v-2" />
          </svg>
        </button>
      )}
    </div>
  );
}

function CandidateIcon({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="8" cy="7" r="4" />
      {status === "pending" && (
        <>
          <circle cx="18" cy="16" r="3" />
          <path d="M18 14.5V16l1 1" />
        </>
      )}
      {status === "approved" && <path d="M15 12l2 2 4-4" />}
      {status === "rejected" && <path d="M16 13l5 5m0-5l-5 5" />}
    </svg>
  );
}
