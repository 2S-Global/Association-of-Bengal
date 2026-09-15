// // import { NextResponse } from "next/server";
// // import {connectDB} from "@/lib/mongodb";
// // import FairConfig from "@/models/formSchema";

// // export const dynamic = "force-dynamic";

// // export async function GET(req: Request) {
// //   try {
// //     await connectDB();
// //     const { searchParams } = new URL(req.url);
// //     const slug = searchParams.get("slug");

// //     if (slug) {
// //       const config = await FairConfig.findOne({ slug });
// //       return NextResponse.json({ success: true, data: config });
// //     }

// //     const activeConfig =
// //       (await FairConfig.findOne({ isActive: true }).lean()) ||
// //       (await FairConfig.findOne().sort({ updatedAt: -1 }).lean());
// //     const all = await FairConfig.find().sort({ createdAt: -1 }).lean();

// //     return NextResponse.json({
// //       success: true,
// //       data: activeConfig || null,
// //       allConfigs: all,
// //     });
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { success: false, error: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function POST(req: Request) {
// //   try {
// //     await connectDB();
// //     const body = await req.json();
// //     if (body.isActive) {
// //       await FairConfig.updateMany({}, { isActive: false });
// //     }
// //     const created = await FairConfig.create(body);
// //     return NextResponse.json({ success: true, data: created });
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { success: false, error: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function PUT(req: Request) {
// //   try {
// //     await connectDB();
// //     const body = await req.json();
// //     if (body.isActive) {
// //       await FairConfig.updateMany({ _id: { $ne: body._id } }, { isActive: false });
// //     }
// //     const updated = await FairConfig.findByIdAndUpdate(body._id, body, {
// //       new: true,
// //       upsert: true,
// //     });
// //     return NextResponse.json({ success: true, data: updated });
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { success: false, error: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import FairConfig from "@/models/formSchema";

// export const dynamic = "force-dynamic";

// const DEFAULT_TERMS_HTML = `
//   <p><strong>1A.</strong> Participation in the fair is open to Publishers and to a limited number of authorised distributors selling only regional books. Approval of participation and exhibits will be at the sole discretion of Publishers &amp; Booksellers Guild (PBG).</p>
//   <p><strong>1B.</strong> Only books and CDs, pendrives and other information material including posters, stamps, cards etc. comprising an integral part of the book may be exhibited and sold at the fair. However, any material in whatever form comprising, in whole or in part, forbidden literature or violating the laws of India shall not be allowed to be exhibited or sold at the fair.</p>
//   <p><strong>1C.</strong> CDs, pendrives or other information materials such as music, games etc. not forming part of the book shall not be allowed to be exhibited or sold at the fair except in stalls in separate enclosures set up for the purpose.</p>
//   <p><strong>1D.</strong> Rosary beads, incense sticks and materials other than books should not be exhibited or sold in the fairground.</p>
//   <p><strong>2A.</strong> Participants have to allow a discount of 10% on the printed price of the book to the customers at the fair and must display exchange rates in case of books having printed price in foreign currency and produce lists and catalogues on demand.</p>
//   <p><strong>2B.</strong> Publicity or promotional materials other than that related to the participant's publications should not be displayed in the stall.</p>
//   <p><strong>2C.</strong> Participant under whose name the stall is allotted will not be allowed to share the space partly or fully with any other publisher/bookseller.</p>
//   <p><strong>3.</strong> Each Stall will be provided with an Entry Gate, three side partitions, fascia and platform. For every 9 sq. mt. of stall, one LED batten, 1 table and 2 chairs &amp; a maximum of 18 shelves will be provided. Additional lights may be provided subject to prior application to fair authorities, availability of fittings and adequate power load for which charges (both for fittings and power consumption) will have to be paid separately. These, however, cannot be claimed as a matter of right.</p>
//   <p><strong>3A.</strong> The corner stalls will be provided with one Gate only. However, Gates on two sides may be provided subject to prior approval of the Fair Authorities and will have to be paid separately.</p>
//   <p><strong>4.</strong> Space Allocation: Space allocation will be made by Publishers &amp; Booksellers Guild and the space will be allocated to Exhibitors by name and no subletting will be allowed in any manner.</p>
//   <p><strong>5.</strong> Booking will be accepted subject to availability of space. Priority will be extended to Publishers, Foreign participants and government agencies. Mere submission of the application form does not confirm acceptance of booking. Allotment of stalls will be provisional and in case of exigencies may be altered at any time prior to the inauguration of the fair. In case of disputes, the decision of the organizers is final.</p>
//   <p><strong>6.</strong> Encroachment in any form (E.g.: Display and sale of books and posters or any form of art beyond the specified area) is liable for closure of the stall.</p>
//   <p><strong>7.</strong> It is compulsory for every stall holder to fix in their stall one fire extinguisher for every 9 sq. mt. of area allotted.</p>
//   <p><strong>7A.</strong> No inflammable and/or explosive materials could be used for stall decoration.</p>
//   <p><strong>8.</strong> Fire insurance policy must be taken by every participant for their own safety. Coverage must include the value of stocks, furniture and fittings, electronic items. Photocopies of the insurance policy certificates and/or money receipt for payment of premium must be shown as and when necessary.</p>
//   <p><strong>9.</strong> Operation of Stalls: No stall should be left unattended during the exhibition hours. Exhibitors must not obstruct passages.</p>
//   <p><strong>10.</strong> The organizers of the fair reserve the right to postpone the fair, alter the venue or duration or hour of opening, exclude the public and to close the fair early or cancel it altogether if there are unavoidable reasons for doing so. Any of these alterations will not constitute a breach of contracts with exhibitors and the organizers' claim for full payment of the stall amount. They also reserve the right to allot the space as per their own specification, written or unwritten.</p>
//   <p><strong>11.</strong> Anything that may disturb the peace and tranquility of the exhibition will not be allowed. Demonstration, procession and any form of advertisement and publicity that disturbs the sanctity of the fair is strictly prohibited. Use of a Sound Limiter Instrument is mandatory. Audio/video systems may be used only inside the stalls so that the sound does not disturb the neighbouring stalls. In case of video, the set has to be installed inside the stall so that it is not visible from outside. However, in all such cases, prior written permission has to be obtained from the organizers.</p>
//   <p><strong>12.</strong> Corporation Tax and other taxes as may be applicable will have to be paid by the participants on their own. Receipts should be produced at the time of getting the Gate Pass.</p>
//   <p><strong>13.</strong> Electricity Consumption Charges: Power service consumption charges will be as fixed by the organizers in consultation with the Electrical Contractors and will be notified in advance to the participants.</p>
//   <p><strong>14.</strong> Remittance: All remittances in full for stall occupation, seminar halls, etc., have to be made at the time of booking.</p>
//   <p><strong>15.</strong> Possession of Space: Decorations of stalls must be completed by the evening of 20.01.2026 and must be vacated by the evening of 04.02.2026. Participants who fail to vacate the space will have to pay a penalty to the organizers as prescribed by PBG and the organizers shall have the right to remove the exhibits/materials etc. of participants at the risk and cost of participants. Stalls not occupied by 20.01.2026 may be assigned to other applicants at the discretion of the fair authorities. In such cases, the original hirer will not be entitled to any refund of the contribution amount.</p>
//   <p><strong>16.</strong> Security: The organizers will make general security arrangements. However, the participants will be responsible for the security of their exhibits and personal belongings.</p>
//   <p><strong>17.</strong> One participant pass for every 9 sq. mt. of stall area will be issued to participants on production of relevant documents to facilitate entry into the fairground before the opening of the Fair.</p>
//   <p><strong>18.</strong> Parking of vehicles in the fairground: For security reasons, no two-wheelers, four-wheelers or other vehicles will be allowed to be parked inside the fairground during the period when the fair remains open. If any such vehicle is found to be parked in the fairground during the fair, the organizers reserve the right to forcibly remove the same from the fairground at the cost of the participant and any loss or damage caused in such act will have to be borne by the participant.</p>
//   <p><strong>19.</strong> Smoking inside the fairground premises/halls is strictly prohibited.</p>
//   <p><strong>20.</strong> Notes: The organizers reserve the right to refuse or cancel any booking without assigning any reason whatsoever to the applicant.<br/><br/>The terms and conditions mentioned above may be changed if necessary without notice.<br/><br/>Neither the organizers nor their advisors, special invitees, sponsors, officers, employees or agents are responsible in any way whatsoever for any loss, theft, damage or injury of any character suffered by persons or goods due to natural calamity or fire or other accidents during the International Kolkata Book Fair 2026.</p>
//   <p><strong>21.</strong> Dispute: Disputes, if any, arising out of participation in the fair shall fall within the jurisdiction of Calcutta High Court and City Civil Court, Kolkata.</p>
//   <p><strong>22.</strong> The terms and conditions mentioned above will be binding on the participants and any breach/violation of any of the clauses contained herein will call for strict disciplinary action which may include permanent closure of the stall, penalty or otherwise as may be decided by the organizers.</p>
// `;

// const DEFAULT_TIMINGS_PREFILL =
//   "Timing of the Fair: From 12:00 noon to 8:00 PM on all days and 12:00 noon to 9:00 PM on 03.02.2026. Fair timings may be changed by the authorities as may be deemed necessary.";

// function enrich(doc: any) {
//   if (!doc) return doc;
//   const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
//   return {
//     ...obj,
//     termsAndConditionsHTML: obj.termsAndConditionsHTML?.trim() || DEFAULT_TERMS_HTML,
//     fairTimingsText: obj.fairTimingsText?.trim() || DEFAULT_TIMINGS_PREFILL,
//   };
// }

// export async function GET(req: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const slug = searchParams.get("slug");

//     if (slug) {
//       const config = await FairConfig.findOne({ slug }).lean();
//       return NextResponse.json({ success: true, data: enrich(config) });
//     }

//     const activeConfig =
//       (await FairConfig.findOne({ isActive: true }).lean()) ||
//       (await FairConfig.findOne().sort({ updatedAt: -1 }).lean());
//     const all = await FairConfig.find().sort({ createdAt: -1 }).lean();

//     return NextResponse.json({
//       success: true,
//       data: enrich(activeConfig),
//       allConfigs: all.map(enrich),
//     });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     if (body.isActive) {
//       await FairConfig.updateMany({}, { isActive: false });
//     }
//     const created = await FairConfig.create(body);
//     return NextResponse.json({ success: true, data: enrich(created) });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PUT(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { _id, ...rest } = body;
//     if (body.isActive && _id) {
//       await FairConfig.updateMany({ _id: { $ne: _id } }, { isActive: false });
//     } else if (body.isActive) {
//       await FairConfig.updateMany({}, { isActive: false });
//     }
//     const updated = await FairConfig.findByIdAndUpdate(_id, rest, {
//       new: true,
//       upsert: true,
//     });
//     return NextResponse.json({ success: true, data: enrich(updated) });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     if (!id) {
//       return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
//     }
//     await FairConfig.findByIdAndDelete(id);
//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FairConfig from "@/models/formSchema";

export const dynamic = "force-dynamic";

const DEFAULT_TERMS_HTML = `
  <p><strong>1A.</strong> Participation in the fair is open to Publishers and to a limited number of authorised distributors selling only regional books. Approval of participation and exhibits will be at the sole discretion of Publishers &amp; Booksellers Guild (PBG).</p>
  <p><strong>1B.</strong> Only books and CDs, pendrives and other information material including posters, stamps, cards etc. comprising an integral part of the book may be exhibited and sold at the fair. However, any material in whatever form comprising, in whole or in part, forbidden literature or violating the laws of India shall not be allowed to be exhibited or sold at the fair.</p>
  <p><strong>1C.</strong> CDs, pendrives or other information materials such as music, games etc. not forming part of the book shall not be allowed to be exhibited or sold at the fair except in stalls in separate enclosures set up for the purpose.</p>
  <p><strong>1D.</strong> Rosary beads, incense sticks and materials other than books should not be exhibited or sold in the fairground.</p>
  <p><strong>2A.</strong> Participants have to allow a discount of 10% on the printed price of the book to the customers at the fair and must display exchange rates in case of books having printed price in foreign currency and produce lists and catalogues on demand.</p>
  <p><strong>2B.</strong> Publicity or promotional materials other than that related to the participant's publications should not be displayed in the stall.</p>
  <p><strong>2C.</strong> Participant under whose name the stall is allotted will not be allowed to share the space partly or fully with any other publisher/bookseller.</p>
  <p><strong>3.</strong> Each Stall will be provided with an Entry Gate, three side partitions, fascia and platform. For every 9 sq. mt. of stall, one LED batten, 1 table and 2 chairs &amp; a maximum of 18 shelves will be provided. Additional lights may be provided subject to prior application to fair authorities, availability of fittings and adequate power load for which charges (both for fittings and power consumption) will have to be paid separately. These, however, cannot be claimed as a matter of right.</p>
  <p><strong>3A.</strong> The corner stalls will be provided with one Gate only. However, Gates on two sides may be provided subject to prior approval of the Fair Authorities and will have to be paid separately.</p>
  <p><strong>4.</strong> Space Allocation: Space allocation will be made by Publishers &amp; Booksellers Guild and the space will be allocated to Exhibitors by name and no subletting will be allowed in any manner.</p>
  <p><strong>5.</strong> Booking will be accepted subject to availability of space. Priority will be extended to Publishers, Foreign participants and government agencies. Mere submission of the application form does not confirm acceptance of booking. Allotment of stalls will be provisional and in case of exigencies may be altered at any time prior to the inauguration of the fair. In case of disputes, the decision of the organizers is final.</p>
  <p><strong>6.</strong> Encroachment in any form (E.g.: Display and sale of books and posters or any form of art beyond the specified area) is liable for closure of the stall.</p>
  <p><strong>7.</strong> It is compulsory for every stall holder to fix in their stall one fire extinguisher for every 9 sq. mt. of area allotted.</p>
  <p><strong>7A.</strong> No inflammable and/or explosive materials could be used for stall decoration.</p>
  <p><strong>8.</strong> Fire insurance policy must be taken by every participant for their own safety. Coverage must include the value of stocks, furniture and fittings, electronic items. Photocopies of the insurance policy certificates and/or money receipt for payment of premium must be shown as and when necessary.</p>
  <p><strong>9.</strong> Operation of Stalls: No stall should be left unattended during the exhibition hours. Exhibitors must not obstruct passages.</p>
  <p><strong>10.</strong> The organizers of the fair reserve the right to postpone the fair, alter the venue or duration or hour of opening, exclude the public and to close the fair early or cancel it altogether if there are unavoidable reasons for doing so. Any of these alterations will not constitute a breach of contracts with exhibitors and the organizers' claim for full payment of the stall amount. They also reserve the right to allot the space as per their own specification, written or unwritten.</p>
  <p><strong>11.</strong> Anything that may disturb the peace and tranquility of the exhibition will not be allowed. Demonstration, procession and any form of advertisement and publicity that disturbs the sanctity of the fair is strictly prohibited. Use of a Sound Limiter Instrument is mandatory. Audio/video systems may be used only inside the stalls so that the sound does not disturb the neighbouring stalls. In case of video, the set has to be installed inside the stall so that it is not visible from outside. However, in all such cases, prior written permission has to be obtained from the organizers.</p>
  <p><strong>12.</strong> Corporation Tax and other taxes as may be applicable will have to be paid by the participants on their own. Receipts should be produced at the time of getting the Gate Pass.</p>
  <p><strong>13.</strong> Electricity Consumption Charges: Power service consumption charges will be as fixed by the organizers in consultation with the Electrical Contractors and will be notified in advance to the participants.</p>
  <p><strong>14.</strong> Remittance: All remittances in full for stall occupation, seminar halls, etc., have to be made at the time of booking.</p>
  <p><strong>15.</strong> Possession of Space: Decorations of stalls must be completed by the evening of 20.01.2026 and must be vacated by the evening of 04.02.2026. Participants who fail to vacate the space will have to pay a penalty to the organizers as prescribed by PBG and the organizers shall have the right to remove the exhibits/materials etc. of participants at the risk and cost of participants. Stalls not occupied by 20.01.2026 may be assigned to other applicants at the discretion of the fair authorities. In such cases, the original hirer will not be entitled to any refund of the contribution amount.</p>
  <p><strong>16.</strong> Security: The organizers will make general security arrangements. However, the participants will be responsible for the security of their exhibits and personal belongings.</p>
  <p><strong>17.</strong> One participant pass for every 9 sq. mt. of stall area will be issued to participants on production of relevant documents to facilitate entry into the fairground before the opening of the Fair.</p>
  <p><strong>18.</strong> Parking of vehicles in the fairground: For security reasons, no two-wheelers, four-wheelers or other vehicles will be allowed to be parked inside the fairground during the period when the fair remains open. If any such vehicle is found to be parked in the fairground during the fair, the organizers reserve the right to forcibly remove the same from the fairground at the cost of the participant and any loss or damage caused in such act will have to be borne by the participant.</p>
  <p><strong>19.</strong> Smoking inside the fairground premises/halls is strictly prohibited.</p>
  <p><strong>20.</strong> Notes: The organizers reserve the right to refuse or cancel any booking without assigning any reason whatsoever to the applicant.<br/><br/>The terms and conditions mentioned above may be changed if necessary without notice.<br/><br/>Neither the organizers nor their advisors, special invitees, sponsors, officers, employees or agents are responsible in any way whatsoever for any loss, theft, damage or injury of any character suffered by persons or goods due to natural calamity or fire or other accidents during the International Kolkata Book Fair 2026.</p>
  <p><strong>21.</strong> Dispute: Disputes, if any, arising out of participation in the fair shall fall within the jurisdiction of Calcutta High Court and City Civil Court, Kolkata.</p>
  <p><strong>22.</strong> The terms and conditions mentioned above will be binding on the participants and any breach/violation of any of the clauses contained herein will call for strict disciplinary action which may include permanent closure of the stall, penalty or otherwise as may be decided by the organizers.</p>
`;

const DEFAULT_TIMINGS_PREFILL =
  "Timing of the Fair: From 12:00 noon to 8:00 PM on all days and 12:00 noon to 9:00 PM on 03.02.2026. Fair timings may be changed by the authorities as may be deemed necessary.";

function enrich(doc: any) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...obj,
    termsAndConditionsHTML: obj.termsAndConditionsHTML?.trim() || DEFAULT_TERMS_HTML,
    fairTimingsText: obj.fairTimingsText?.trim() || DEFAULT_TIMINGS_PREFILL,
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const config = await FairConfig.findOne({ slug }).lean();
      return NextResponse.json({ success: true, data: enrich(config) });
    }

    const activeConfig =
      (await FairConfig.findOne({ isActive: true }).lean()) ||
      (await FairConfig.findOne().sort({ updatedAt: -1 }).lean());
    const all = await FairConfig.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: enrich(activeConfig),
      allConfigs: all.map(enrich),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { locationName, stallSelectionVenue, tagLabel, ...restBody } = body;
    const finalBody = { ...restBody, locationName, stallSelectionVenue, tagLabel };

    if (finalBody.isActive) {
      await FairConfig.updateMany({}, { isActive: false });
    }
    const created = await FairConfig.create(finalBody);
    return NextResponse.json({ success: true, data: enrich(created) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, locationName, stallSelectionVenue, tagLabel, ...rest } = body;
    
    const updateData = { ...rest, locationName, stallSelectionVenue, tagLabel };

    if (body.isActive && _id) {
      await FairConfig.updateMany({ _id: { $ne: _id } }, { isActive: false });
    } else if (body.isActive) {
      await FairConfig.updateMany({}, { isActive: false });
    }
    const updated = await FairConfig.findByIdAndUpdate(_id, updateData, {
      new: true,
      upsert: true,
    });
    return NextResponse.json({ success: true, data: enrich(updated) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }
    await FairConfig.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}