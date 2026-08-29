export type NominationMember = {
  _id: string;
  fullName: string;
  memberId: string;
  photoUrl: string;
  wings: string[];
};

export type Nomination = {
  _id: string;
  election: string;
  member: NominationMember | null;
  position: string;
  wing: string;
  manifesto: string;
  agreedToTerms: boolean;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
};
