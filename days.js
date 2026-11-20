// NON-SECRET narrative and challenge text ONLY. Never put answers or final reveal here.
// Fictional lab reports below are original, self-contained puzzle clues.
export const DAYS = [
    {
        id: 1, date: 'Nov 30', title: 'Activation & First Contact', tag: 'HANDLER TRACE',
        story: 'Incident 626-A. A Federation artifact is missing. Your assigned handler is allegedly compromised. Before we share the case record, identify the person behind the signal.',
        evidenceTitle: 'Incident Report 626-A',
        evidence: 'A dispatch labeled “Agent Wyatt” was recovered with a corrupted signature. A note says the sender is also the answer to the first cipher.',
        hidden: 'Not every beginning looks important at first.',
        message: '626 NOT steal artifact. 626 BORROW future. Also snacks. Mainly snacks. Check the numbers, fluffy agent!',
        question: 'Decode the transmission using A=1, B=2, ... Z=26. Then enter the decoded five-letter handler designation.',
        data: '23 - 25 - 01 - 20 - 20'
    },
    {
        id: 2, date: 'Dec 1', title: 'Franklin High Anomaly', tag: 'CLASSROOM FORENSICS',
        story: 'An anomalous first-contact event has been traced to Franklin High School. Archived seating records refer to Mr. Pergrem’s classroom.',
        evidenceTitle: 'Seating Diagram: Pergrem-01',
        evidence: 'Four desks are arranged left to right. The monitor sat farthest left; Wyatt sat two desks to the right of the monitor; Bella sat immediately left of Wyatt; the runner took the remaining desk.',
        hidden: 'The ordinary place where two lives crossed can become a landmark.',
        message: 'CLASSROOM HAS TOO MANY DESKS. 626 sit on ceiling. Count from LEFT!',
        question: 'Assign the four occupants M (monitor), W (Wyatt), B (Bella), R (runner) to desks 1–4, left to right. What two-letter sequence occupies desks 2 and 3?',
        data: 'DESKS  1   2   3   4\nMONITOR: far left\nWYATT: two desks right of monitor\nBELLA: immediately left of Wyatt\nRUNNER: remaining desk'
    },
    {
        id: 3, date: 'Dec 2', title: 'Homecoming Surveillance', tag: 'CAMERA RECONSTRUCTION',
        story: 'The Federation intercepted three images of a school event. Reported significance: the first time two subjects were really out together.',
        evidenceTitle: 'Homecoming Camera Reel',
        evidence: 'C: doors opening, 17:50. A: dance floor lights, 18:10. B: photograph taken, 19:05. File order was deliberately scrambled.',
        hidden: 'Sometimes the memory matters more than the photograph.',
        message: '626 loves dances! 626 has SIX left feet. Put pictures in TIME order.',
        question: 'Put the camera IDs in chronological order to recover the surveillance key.',
        data: 'FRAME A — dance floor — 18:10\nFRAME B — portrait booth — 19:05\nFRAME C — doors opening — 17:50'
    },
    {
        id: 4, date: 'Dec 3', title: 'Bright Lights Incident', tag: 'PUBLIC SAFETY',
        story: 'A spectacularly unhelpful illumination event was filed under accidental civilian dazzling. Four lights must be reconstructed in witness order.',
        evidenceTitle: 'Flash Pattern Reconstruction',
        evidence: 'Witness order: bottom-left, directly above it, diagonally opposite that position, then the only unvisited position.',
        hidden: 'Some chaos is worth laughing about twice.',
        message: 'WHO TURNED ON THE SUN? Oh. That was us. Please do not blind investigators.',
        question: 'Use the grid and witness order. Enter the four letters in flash order.',
        data: 'A (upper-left)     B (upper-right)\nC (lower-left)     D (lower-right)\n1. bottom-left\n2. directly above #1\n3. diagonal opposite #2\n4. only unused lamp'
    },
    {
        id: 5, date: 'Dec 4', title: 'Unknown Blue Entity', tag: 'CHROMATIC ANOMALY',
        story: 'The artifact trail crosses a blue-spectrum anomaly. Standard filters failed. Only the cobalt-tinted entries can be trusted.',
        evidenceTitle: 'Blue Ink Redactions',
        evidence: 'Read the initials of the entries stamped BLUE, top to bottom. All BLACK-stamped entries are decoys.',
        hidden: 'Some colors have a way of following a person through a story.',
        message: 'BLUE BLUE BLUE. 626 is also BLUE. Coincidence??? Probably. Read only the BLUE labels!',
        question: 'Read the FIRST letters of the four BLUE entries, in report order.',
        data: 'BLUE  Beacon\nBLACK Vortex\nBLUE  Lunar\nBLACK Ration\nBLUE  Umbra\nBLACK Nebula\nBLUE  Echo'
    },
    {
        id: 6, date: 'Dec 5', title: 'Monster Protocol', tag: 'ENERGY LAB',
        story: 'A highly caffeinated compound appears in the evidence chain. All sample labels are fictional; no physical can is required.',
        evidenceTitle: 'Batch Sequence M-626',
        evidence: 'The numeric section increases by four. The letter section advances alphabetically, wrapping Z to A.',
        hidden: 'A favorite drink became a lab signature.',
        message: '626 DRINK TOO MUCH ENERGY. 626 NOW CAN SEE TOMORROW. Letter after Z goes WHAT?',
        question: 'Fill the missing complete batch label.',
        data: 'M-04-X\nM-08-Y\nM-12-Z\nM-16-?'
    },
    {
        id: 7, date: 'Dec 6', title: 'Wolf Signature', tag: 'TRACK ANALYSIS',
        story: 'A wolf-shaped signature is embedded in six sector scans. Four scans match; two are deliberate forgeries.',
        evidenceTitle: 'Sector Pawprints',
        evidence: 'The true track is ▲ ● ▲. A forgery reverses the shapes or substitutes a diamond. Read the sector letter from every exact match, top to bottom.',
        hidden: 'The wolf is not the threat. The old archive index also mentions the unlisted /classified annex.',
        message: 'WOLF? 626 like wolf. Wolf probably better detective. SAME three symbols, no fakes.',
        question: 'Write the letters from sectors with an exact track match.',
        data: 'SECTOR W  ▲ ● ▲\nSECTOR X  ▲ ◆ ▲\nSECTOR O  ▲ ● ▲\nSECTOR Q  ● ▲ ●\nSECTOR L  ▲ ● ▲\nSECTOR F  ▲ ● ▲'
    },
    {
        id: 8, date: 'Dec 7', title: 'Smile Vector Analysis', tag: 'SIGNAL ATTRIBUTION',
        story: 'An unclassified smile has caused repeated spikes in Agent Wyatt’s biometric readings. The Federation claims this is statistically suspicious.',
        evidenceTitle: 'Vector Report: SM-08',
        evidence: 'A qualifying smile has total brightness greater than 10 and symmetry at least 5. Only one sample passes both rules.',
        hidden: 'Some things you notice once, then notice forever.',
        message: 'SMILE TOO POWERFUL. Federation needs sunglasses. Add the numbers!',
        question: 'Find the ONLY qualifying sample and enter its attached code.',
        data: 'A: brightness 4 + 3, symmetry 5 → code MIR-01\nB: brightness 8 + 5, symmetry 6 → code IRR-08\nC: brightness 7 + 2, symmetry 4 → code SOL-11'
    },
    {
        id: 9, date: 'Dec 8', title: 'First Contact: “Hi”', tag: 'VOICE LOG',
        story: 'The first words of an unremarkable conversation were recorded. Subsequent analysis assigned those two letters an unexpectedly high significance.',
        evidenceTitle: 'Corrupted Greeting Log',
        evidence: 'Original recording fragments are arranged by timestamp. Read the earliest speaker’s single-word message.',
        hidden: 'The smallest word can be the beginning of a very large story.',
        message: '626 TALK A LOT. Sometimes one little word does more than 626 whole speech.',
        question: 'Restore chronological order; enter the FIRST spoken word.',
        data: '08:15 — WYATT: “How is your day?”\n08:13 — BELLA: “Hi”\n08:16 — BELLA: “Good!”\n08:14 — WYATT: “Hey!”'
    },
    {
        id: 10, date: 'Dec 9', title: 'Stayed When It Was Hard', tag: 'RELIABILITY AUDIT',
        story: 'Four verified transmissions remained after a communications failure. The others were labeled unreliable. The verified signal says more than the Federation understands.',
        evidenceTitle: 'Retention Signal ST-10',
        evidence: 'Only clearance level 4 transmissions are reliable. Order reliable transmissions by their timestamp to reveal the message.',
        hidden: 'An act of staying can change what somebody believes about belonging.',
        message: '626 KNOW: leaving is easy. Staying? Strong. Also glue. Glue stays too.',
        question: 'Read one character from each clearance-4 transmission in increasing time order.',
        data: '03:30 clearance-4 = Y\n01:45 clearance-1 = X\n03:00 clearance-4 = A\n02:00 clearance-4 = S\n02:30 clearance-4 = T\n02:10 clearance-1 = Q'
    },
    {
        id: 11, date: 'Dec 10', title: 'Family Classification', tag: 'SOCIAL BOND MATRIX',
        story: 'Federation sociologists discovered a type of loyalty that refuses to fit a bureaucratic category. Informant note: “It is chosen, not assigned.”',
        evidenceTitle: 'Classification Tree OH-11',
        evidence: 'Follow the path: chosen → stays → belonging. Take its designation.',
        hidden: 'A family can be formed by a thousand small choices. The routing stamp reads /archive/ohana.',
        message: 'OHANA? Federation says “undefined.” 626 says “you know.”',
        question: 'Which designation matches all three properties: CHOSEN, STAYS, BELONGING?',
        data: 'OMEGA — assigned / temporary / duty\nOHANA — chosen / stays / belonging\nORBIT — chosen / temporary / distance\nOMELET — breakfast / delicious / unrelated'
    },
    {
        id: 12, date: 'Dec 11', title: 'Lion King Echoes', tag: 'CULTURAL RESONANCE',
        story: 'The Federation’s cultural archive flags a story about a lion, the natural world, and the meaning of belonging. A familiar favorite appears in the margins.',
        evidenceTitle: 'Circle Motif: Original Echoes',
        evidence: 'Four original descriptions are arranged from the beginning to the end of a day. Each description carries a letter tag.',
        hidden: 'The place you return to is not always a physical place.',
        message: '626 audition for lion movie. ROAR. 626 did not get job. Sort sunrise to nighttime!',
        question: 'Order the four scene tags by time of day and read the letters.',
        data: 'Dusk / the sky cools / E\nSunrise / new light / H\nMidday / long shadows vanish / O\nAfternoon / warmth fading / M'
    },
    {
        id: 13, date: 'Dec 12', title: 'Halloween Residue', tag: 'COSTUME INCIDENT',
        story: 'An autumn nighttime file resurfaces. A suspect stood out from the crowd. Only one costume matches all the witness details.',
        evidenceTitle: 'Costume Ledger HW-13',
        evidence: 'The suspect wore a BLUE wristband, carried a PAPER MOON, and wore NO cape. The costume code is your access word.',
        hidden: 'A night out turned into an archived piece of a bigger story.',
        message: '626 costume was “responsible adult.” Nobody believed it. Check THREE clues.',
        question: 'Which costume code matches every eyewitness condition?',
        data: 'GHOST: blue wristband / paper moon / no cape\nWITCH: black wristband / paper moon / cape\nWOLF: blue wristband / silver bell / no cape\nSTAR: blue wristband / paper moon / cape'
    },
    {
        id: 14, date: 'Dec 13', title: 'Artifact Triangulation', tag: 'PARALLEL INVESTIGATION',
        story: 'URGENT: the Unknown Informant admits a second investigation has been running beside yours. Look at the small evidence stamps you collected every day. They have an order.',
        evidenceTitle: 'Triangulation Coordinates',
        evidence: 'Three independent scans are consistent at one grid location. X-line: x=4. Y-line: y=2. Diagonal constraint: x+y=6.',
        hidden: 'Your collected stamp symbols are not random. Read them chronologically tomorrow, including the final stamp.',
        message: 'TWO INVESTIGATIONS?! 626 only brought ONE notebook! X then Y. And keep those tiny stamps.',
        question: 'Which coordinate satisfies all three scans? Enter X followed by Y (no comma).',
        data: 'SCANNER A: x = 4\nSCANNER B: y = 2\nSCANNER C: x + y = 6\nKEY FORMAT: XY'
    },
    {
        id: 15, date: 'Dec 14', title: 'Final Retrieval Window', tag: 'FINAL CLEARANCE',
        story: 'One final authorized request remains. The Federation demands the recovery STATUS used in the original incident report. Submit it; then assemble the fifteen evidence stamps you collected.',
        evidenceTitle: 'Status Reconciliation',
        evidence: 'Recovered means no longer missing. The Federation status field accepts that one word in uppercase.',
        hidden: 'The final stamp completes a fifteen-character sentence. Keep all letters, remove spaces. Vault cross-index: /vault/final.',
        message: '626 have final paperwork. 626 ate corner of paperwork. You can do it! Maybe 626 help with snacks.',
        question: 'Complete the final status field: ARTIFACT STATUS = ________.',
        data: 'STATUS OPTIONS\nMISSING\nDESTROYED\nRECOVERED\nUNVERIFIED'
    }
];
export const suspects = [
    { name: 'Experiment 626', role: 'Prime suspect', description: 'Blue, chaotic, suspiciously interested in snacks. Has left helpful clues in every transmission.' },
    { name: 'Agent Wyatt', role: 'Case handler', description: 'Knows too much about Franklin High School and Homecoming. Classified personal association.' },
    { name: 'Unknown Informant', role: 'Encrypted source', description: 'Offers precise guidance with a strange interest in belonging and loyalty.' },
    { name: 'Galactic Federation', role: 'Issuing authority', description: 'Runs a strict deadline, a colder bureaucracy, and an impressive paperwork collection.' },
];
export function dayUnlockAt(day) {
    // 08:00 America/New_York; Nov 30–Dec 14 2026 are all EST (UTC-5).
    return new Date(Date.UTC(2026, day === 1 ? 10 : 11, day === 1 ? 30 : day - 1, 13, 0, 0));
}
export function dateLabel(ts) {
    if (!ts)
        return 'No activity yet';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}
