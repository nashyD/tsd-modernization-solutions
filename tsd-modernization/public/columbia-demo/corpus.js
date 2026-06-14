/* =====================================================================
   IBC Assistant — demo knowledge base
   ---------------------------------------------------------------------
   Every entry below is a grounded, citable passage drawn from the real
   documents Columbia provides to IBC staff:
     • IBC Residential Life Handbook (Summer 2026)
     • IBC 2026 BCD (Behavioral Conduct & De-escalation) Training Groups
     • IBC 2026 CPR/AED Training Groups
   In a production deployment these chunks are produced automatically by
   TSD's ingestion pipeline from the source files (.docx / .pdf / Canvas).
   They are reproduced here so the demo answers from the program's own
   words — never invented. Facts are faithful to the source; an obvious
   typo in the duty-rounds cadence ("45 hours" → 45 minutes) is rendered
   correctly.
   ===================================================================== */
window.IBC_CORPUS = [
  /* ---------------------------- CURFEW ---------------------------- */
  {
    id: "curfew-times",
    category: "Curfew & Hall Coverage",
    title: "In-building and in-room curfew times",
    body:
      "There are two nightly curfews. IN-BUILDING curfew (RAs must be in their building to run checks): Sunday–Thursday 9:00 PM, Friday–Saturday 10:00 PM. After in-building curfew, students must remain in the building until the next morning. IN-ROOM curfew (RAs are off after in-room checks are complete, unless on duty): Sunday–Thursday 11:00 PM, Friday–Saturday 12:00 AM. Curfew ends at 6:00 AM daily.",
    source: "IBC Residential Life Handbook — Curfew Check",
    tags: ["curfew", "in-building", "in-room", "weekend", "friday", "saturday", "time", "9pm", "10pm", "11pm", "midnight", "night", "lights out", "bed"]
  },
  {
    id: "curfew-procedure",
    category: "Curfew & Hall Coverage",
    title: "How to run a curfew check",
    body:
      "RAs must see each student face-to-face to confirm their presence. Students cannot be checked in via text, group chat, or through another RA without supervisor approval. At in-building curfew, students meet their RA at the designated meeting location. At in-room curfew, all students must be in their assigned dorm rooms (they do not have to be asleep) — knock on each student's door to confirm. RAs must stay in the hall during and between curfew checks.",
    source: "IBC Residential Life Handbook — Curfew Check",
    tags: ["curfew check", "face to face", "roll call", "knock", "check in", "attendance", "meeting location"]
  },
  {
    id: "curfew-late",
    category: "Curfew & Hall Coverage",
    title: "What to do when a student is late for curfew",
    body:
      "If a student is UNDER 30 minutes late to curfew, log it in the curfew tracker form. If a student is more than 30 minutes late, an Incident Report (IR) must be completed and follow-up will occur with your building's Resident Director (RD). RAs chaperoning students who will be back past curfew should remind those students to stay in regular contact with their RA.",
    source: "IBC Residential Life Handbook — Curfew Check",
    tags: ["late", "tardy", "missed curfew", "30 minutes", "tracker", "incident report", "IR", "missing student"]
  },
  {
    id: "hall-coverage",
    category: "Curfew & Hall Coverage",
    title: "Hall coverage between curfews",
    body:
      "Unless it is their designated time off, ALL interns — including commuter and online RAs — must be in their designated residence hall between in-building curfew and in-room curfew each night. Interns must be visible and accessible during this time to help with emerging student and program needs. Interns cannot be in another part of campus or off-campus during this time, nor can they be in their room with the door closed.",
    source: "IBC Residential Life Handbook — Hall Coverage",
    tags: ["hall coverage", "presence", "visible", "between curfews", "door closed", "available"]
  },

  /* ------------------------- SHIFTS & DUTY ------------------------ */
  {
    id: "shift-overview",
    category: "Shifts & Duty",
    title: "How many shifts you work",
    body:
      "There are several daytime shift types: lounge shifts, floater shifts, and program kiosk shifts. Interns are expected to serve in at least two lounge/office shifts per week, along with 1–2 overnight duty shifts per week.",
    source: "IBC Residential Life Handbook — Shifts and Duty Assignments",
    tags: ["shifts", "how many", "schedule", "lounge", "floater", "kiosk", "per week", "overnight"]
  },
  {
    id: "lounge-shift",
    category: "Shifts & Duty",
    title: "Lounge shift responsibilities",
    body:
      "On a lounge shift (in the building lobby) you greet students, ensure no one exits after in-building curfew, stop students entering after curfew, answer policy questions, assist with Public Safety/building access and lockouts, escort facilities staff, keep common areas clean, manage elevator loads and noise, and generally oversee building safety. Report to your assigned station on the shift spreadsheet. You may NOT nap, play video games, or leave the building except on your official break, and you must be dressed appropriately (no pajamas). Keep your phone on for lockout and health-form calls. For issues before 5:00 PM, contact your building RD; after 5:00 PM, call the RD on duty; if unavailable, call the Assistant Director by cell.",
    source: "IBC Residential Life Handbook — Lounge Shifts",
    tags: ["lounge", "lobby", "shift duties", "station", "phone on", "dress code", "lockout"]
  },
  {
    id: "floater-shift",
    category: "Shifts & Duty",
    title: "Floater shifts and the task priority list",
    body:
      "Floaters assist with daytime program needs across campus. When not given a direct task, floaters wait in the Student Services Office with phones on. Tasks may include taking students to the health center, picking up food for sick students, running errands for an administrator, covering a break, or helping at an event. If called by multiple staff, follow this PRIORITY order: (1) Student Health Center visit, (2) Task assigned by an administrator, (3) Break coverage, (4) Task assigned by a Coordinator or RD. Communicate with anyone whose task you must postpone for a higher priority.",
    source: "IBC Residential Life Handbook — Floater Shifts",
    tags: ["floater", "priority", "task", "health center", "errand", "break coverage", "student services office"]
  },
  {
    id: "breaks",
    category: "Shifts & Duty",
    title: "Breaks during shifts",
    body:
      "Staff are allotted one unpaid 30-minute break during their shifts. To take it, coordinate with other staff so at least one person remains on-site at all times. You MUST take a break whenever you work a formal shift, and you must reflect the break on your timesheet. Example: scheduled 10:30 AM–3:00 PM with a 30-minute break = four hours on your timesheet. Keep your phone on you and stay responsive to admin during shifts.",
    source: "IBC Residential Life Handbook — Breaks",
    tags: ["break", "30 minutes", "unpaid", "timesheet", "lunch", "rest"]
  },
  {
    id: "on-duty",
    category: "Shifts & Duty",
    title: "Being on duty / on call overnight",
    body:
      "About twice per week you will be on duty — in the residence hall overnight from in-room curfew until the morning lounge shift. Check in with the RD on duty for special instructions. Complete floor/building rounds at 15 minutes, 45 minutes, and 75 minutes after curfew, and tell your SRA when each round is done. Keep your ringer ON and off Do-Not-Disturb all night. Send an updated report if anything comes up overnight, submit your duty report at 8:50 AM, and have all Maxient reports in before 9:00 AM. You may NOT leave the building for any reason while on duty — pick up food before in-building curfew. Leaving while on duty results in a formal write-up with HR.",
    source: "IBC Residential Life Handbook — Being On Duty / On Call",
    tags: ["on duty", "on call", "overnight", "rounds", "15 45 75", "duty report", "maxient", "8:50", "leave building"]
  },

  /* --------------------------- KEYS & ID -------------------------- */
  {
    id: "cuid-card",
    category: "Keys & Access",
    title: "Your Columbia ID (CUID) card",
    body:
      "You receive a CUID card on move-in day. It grants access to the residence halls, Ferris Booth Dining Hall, Uris Hall, Lerner Student Center, and Dodge Fitness Center. If you lose it, the ID Office in Kent Hall issues a replacement; after that you must visit Furnald Hall to have the card re-encoded with your housing access. Under no circumstances should you let anyone — intern, staff, or student — borrow your ID card.",
    source: "IBC Residential Life Handbook — Keys & Your Columbia ID Card",
    tags: ["id", "cuid", "card", "lost id", "kent hall", "furnald", "access", "swipe"]
  },
  {
    id: "master-keys",
    category: "Keys & Access",
    title: "Master keys and student lockouts",
    body:
      "Each residence hall has a Master Key held by the SRA on duty. Master keys must be given to a Housing Coordinator each Friday morning to be re-encoded. Before using a master key to let a student in, check the building roster or Orah to verify they are assigned to that room, and confirm the student has their ID in the room (or arrange an escort to Kent Hall during business hours if it is lost). Return the master key to the storing staff member immediately after use. After hours or on weekends, contact the Housing Coordinator on call about a temporary access card.",
    source: "IBC Residential Life Handbook — Keys: Lost, Sharing, Replacement, Master Keys",
    tags: ["master key", "lockout", "locked out", "housing coordinator", "orah", "roster", "temporary card", "re-encode"]
  },

  /* ----------------------- EMERGENCIES & HEALTH ------------------- */
  {
    id: "emergency-numbers",
    category: "Emergencies & Health",
    title: "Emergency phone numbers",
    body:
      "Columbia University Public Safety (Morningside) EMERGENCY line: 212-854-5555 — open 24/7, arranges emergency responses. From any campus phone, dial 4-5555. Public Safety non-emergency (Morningside): 212-854-2797. General emergency: 911. Columbia Health Services: 212-854-2284. New York State Child Abuse & Maltreatment Hotline: 800-342-3720. Medical Center Public Safety: 212-305-7979. Public Safety email (monitored): publicsafety@columbia.edu. Save all of these in your phone.",
    source: "IBC Residential Life Handbook — Be in Touch / Public Safety",
    tags: ["emergency", "public safety", "911", "phone number", "call", "212-854-5555", "hotline", "urgent"]
  },
  {
    id: "medical-emergency",
    category: "Emergencies & Health",
    title: "Handling a medical emergency",
    body:
      "For an urgent emergency ON campus, call Columbia Public Safety at 212-854-5555 (open 24/7); they arrange emergency responses. For an OFF-campus emergency, call 911 first, then call your SRA or RD. If a student appears to be in immediate danger, call Public Safety (212-854-5555) or 911 right away.",
    source: "IBC Residential Life Handbook — Medical Emergencies",
    tags: ["medical emergency", "ambulance", "injury", "danger", "911", "public safety", "urgent"]
  },
  {
    id: "health-services",
    category: "Emergencies & Health",
    title: "Columbia Health Services — hours and how to use it",
    body:
      "Health Services is on the 3rd floor of John Jay Hall, open Monday–Thursday 9:00 AM–5:00 PM and Friday 9:00 AM–4:00 PM. Urgent-care patients are seen without an appointment; for non-urgent needs, call 212-854-2284 to book. Urgent-care exams, guidance, and prescriptions are free (further testing/bloodwork is billed to insurance/student). A student MUST be accompanied by their RA or another program assistant, who should carry the student's health info. Tell the receptionist you are with 'the Columbia University Pre-College Program.' Encourage students to report illness during the day — waiting until evening usually means a long hospital ER visit. If a student says they are too ill for class, they must go to Health Services. Direct questions to Assistant Director Jeannette Sanchez.",
    source: "IBC Residential Life Handbook — Columbia University Health Services",
    tags: ["health services", "sick", "ill", "john jay", "appointment", "212-854-2284", "doctor", "nurse", "accompany"]
  },
  {
    id: "hospital",
    category: "Emergencies & Health",
    title: "Taking a student to the hospital",
    body:
      "After Health Services closes, students go to Mt. Sinai St. Luke's Hospital, across from campus on Amsterdam Avenue. Contact the RD on call BEFORE escorting a student, as a Coordinator may need to go too. The ER entrance is on 113th Street just east of Amsterdam; have the student check in at PEDIATRICS to speed response. Bring phone chargers and something warm — it is cold and can be a long night. You will not be made to stay all night; Senior Staff or Coordinators/Directors rotate you out. If you are off-campus and need a hospital, take a cab (chargeable to a P-Card) and follow directions from the director on call.",
    source: "IBC Residential Life Handbook — Hospitals",
    tags: ["hospital", "st luke's", "mount sinai", "emergency room", "ER", "amsterdam", "pediatrics", "113th"]
  },
  {
    id: "heat-dehydration",
    category: "Emergencies & Health",
    title: "Heat and dehydration",
    body:
      "NYC summers are very hot and each summer a student or two faints from heat exhaustion. Promote water drinking, take frequent breaks during activities, and be strict about hydration — stop an activity and make students drink if needed. Avoid strenuous outdoor exercise in the heat; schedule it for cooler morning or evening hours.",
    source: "IBC Residential Life Handbook — Dehydration & Heat",
    tags: ["heat", "dehydration", "water", "hydrate", "faint", "exhaustion", "hot", "summer"]
  },
  {
    id: "allergies",
    category: "Emergencies & Health",
    title: "Student allergies",
    body:
      "Food allergies are common; also watch for allergies to bees/wasps and medications. Review each student's health form to learn their allergies, reactions, treatment, and the response you can provide. If an allergy is food-related, make sure other students know the necessary precautions.",
    source: "IBC Residential Life Handbook — Allergies",
    tags: ["allergy", "allergies", "food allergy", "epipen", "bee", "health form", "reaction"]
  },
  {
    id: "sexual-health",
    category: "Emergencies & Health",
    title: "Sexual health and condoms",
    body:
      "RAs are not permitted to distribute condoms to students, but should inform students that a safe-sex / sexual-health / Plan-B vending machine is located in the lobby of John Jay Hall. Free condoms are available at Health Services and outside the elevator on the 8th floor of Lerner Hall.",
    source: "IBC Residential Life Handbook — Sexual Health & Condoms",
    tags: ["condom", "sexual health", "plan b", "vending machine", "john jay", "lerner", "safe sex"]
  },
  {
    id: "gas-maintenance",
    category: "Emergencies & Health",
    title: "Dorm maintenance and gas-smell emergencies",
    body:
      "For routine dorm condition, A/C, or facilities issues, contact the Housing Coordinator. For an emergency (untraceable smell of gas, electricity problems, flooding) go immediately to the security desk and have the Public Safety guard call Facilities/emergency personnel, then notify your RD. If you smell gas, first check the hall lounge stove for a turned knob — if that's the source, shut it off and open windows (no emergency personnel needed). If you cannot find the source, leave immediately with anyone else present and contact a Public Safety guard and the RD.",
    source: "IBC Residential Life Handbook — Dorm Maintenance Issues",
    tags: ["maintenance", "gas", "smell", "flooding", "electricity", "facilities", "housing coordinator", "AC", "air conditioning"]
  },

  /* --------------------- SAFETY & EXCURSIONS ---------------------- */
  {
    id: "excursion-ratio",
    category: "Safety & Excursions",
    title: "Excursion supervision ratio and P-Cards",
    body:
      "All excursions must keep a ratio of 1 RA to every 5 residents for safety. Interns can and should run excursions, but emphasis should be on in-building programming for residents who lack the time or money for trips. When buying meals on an excursion, P-Cards are for actual meals only — not snacks or drinks — with a water exception for heat and safety.",
    source: "IBC Residential Life Handbook — Excursions",
    tags: ["excursion", "trip", "ratio", "1 to 5", "chaperone", "p-card", "meals", "field trip"]
  },
  {
    id: "nyc-safety",
    category: "Safety & Excursions",
    title: "General NYC safety guidance for trips",
    body:
      "Before each trip remind students to carry a charged phone and the RA/Residence Life office numbers, stay with the group, and use a buddy system. Keep staff at the front and rear, do head counts every few minutes, and set a clear return time/location for any free time. Keep wallets in front pockets in crowds; don't flaunt valuables; be skeptical of unsolicited offers and street scams. Near Columbia, 'Safe Havens' are stores (marked with a red-lion decal) that provide a secure place for students. Subway note: returning to Columbia, don't ride the 2/3 past 96th St — transfer to the 1 train, which stops at campus. When in doubt late at night, take a cab (all NYC cabs accept credit cards).",
    source: "IBC Residential Life Handbook — General Safety Advice",
    tags: ["safety", "nyc", "subway", "1 train", "safe haven", "scam", "buddy system", "head count", "trip", "valuables"]
  },
  {
    id: "active-shooter",
    category: "Safety & Excursions",
    title: "Active shooter protocol",
    body:
      "If an active-shooter event occurs while you are in a building: secure your immediate area — lock and barricade doors, stay away from doors/windows, turn off lights, close blinds, turn off radios/monitors, and take cover behind solid objects. Contact authorities: dial 4-5555 from any CU phone, or 911, or email publicsafety@columbia.edu (the 212-854-5555 line will likely be overwhelmed; program the backup 212-854-2797 into your phone). Report your exact building and room, number of people with you, injuries, and assailant details (location, number, description, weapon type). Police will engage the assailant immediately. Only consider un-securing a room if it can be done without further endangering anyone, and know your building's alternate exits.",
    source: "IBC Residential Life Handbook — Active Shooter Incident",
    tags: ["active shooter", "lockdown", "barricade", "shelter", "violence", "weapon", "emergency"]
  },

  /* --------------- REPORTING & PROTECTION OF MINORS --------------- */
  {
    id: "protection-of-minors",
    category: "Reporting & Protection of Minors",
    title: "Protection of Minors — your duty to report",
    body:
      "All faculty and staff are mandated reporters with an independent legal duty to report suspected abuse or maltreatment of anyone under 18, immediately. If you suspect a minor may have been abused, maltreated, or is otherwise in danger: (1) if a child is in immediate danger, call 911; (2) call the New York State Child Abuse & Maltreatment Hotline at 800-342-3720; (3) complete the Protection of Minors Report Form (bit.ly/pomreport); AND (4) call Public Safety at 212-854-5555 (Morningside). Due to privacy, there may be no general announcement to the IBC after such a report. If you don't see a sufficient response, call Public Safety to share your concerns.",
    source: "IBC Residential Life Handbook — Protection of Minors",
    tags: ["protection of minors", "POM", "abuse", "maltreatment", "mandated reporter", "minor", "child", "hotline", "report", "800-342-3720"]
  },
  {
    id: "incident-report",
    category: "Reporting & Protection of Minors",
    title: "Incident Reports and Students of Concern",
    body:
      "To report a policy violation OR a student of concern, file an Incident Report at bit.ly/spsconcern. When writing a report: focus on observable behaviors ('the student was tearful through the meeting'), provide specifics (how often a behavior occurred), and avoid labels or pejoratives ('acting crazy'). After submission, an automatic email goes to the SPS CARE Team and stakeholders, and a point person is assigned for follow-up. For privacy, the CARE Team usually does not share the student's outcome with the reporter. Managing the situation in front of you comes first — the report is secondary to everyone's safety.",
    source: "IBC Residential Life Handbook — Reporting Protocols",
    tags: ["incident report", "IR", "student of concern", "maxient", "report form", "care team", "spsconcern", "documentation"]
  },
  {
    id: "gender-based-misconduct",
    category: "Reporting & Protection of Minors",
    title: "Gender-based misconduct reporting",
    body:
      "Sexual harassment, sexual assault, sexual exploitation, gender-based harassment, stalking, domestic violence, and dating violence are all forms of gender-based misconduct, and program staff are obligated to report any they become aware of. Students who believe they have been subjected to it should immediately call the Program Office or report to the Director of Student Affairs. File the Gender-Based Misconduct Report Form at bit.ly/gbmreport. Reports go to Public Safety and Student Conduct and Community Standards; the Gender-Based Misconduct Office is the central contact and determines the resolution process.",
    source: "IBC Residential Life Handbook — Gender-Based Misconduct",
    tags: ["gender-based misconduct", "title ix", "harassment", "sexual assault", "stalking", "report", "gbmreport"]
  },
  {
    id: "when-to-call-public-safety",
    category: "Reporting & Protection of Minors",
    title: "When to call Public Safety (crisis)",
    body:
      "Call Public Safety at 212-854-5555 when an incident is nearing crisis — when a person's behavior poses imminent danger of harming self or others, impeding others' lawful activities, or interfering with the health/safety/well-being of the community, or when someone has a health emergency or posts suicidal/harmful intent online. Situations that warrant a call include uncontrollable/violent/suicidal/homicidal behavior, seizures, labored breathing, physical injury, unconsciousness, hallucinations or intense pain, inability to speak or walk, or a dangerous level of intoxication. If unsure whether a crisis exists, err on the side of caution and call.",
    source: "IBC Residential Life Handbook — When to Call Public Safety/NYPD",
    tags: ["crisis", "public safety", "call", "danger", "intoxication", "seizure", "self-harm", "emergency", "when to call"]
  },

  /* --------------------- STUDENT SUPPORT / WELLNESS --------------- */
  {
    id: "emotional-distress",
    category: "Student Support & Wellness",
    title: "Supporting a student in emotional distress",
    body:
      "The number-one rule: YOU CANNOT HELP THE STUDENT ON YOUR OWN — the most caring thing you can do is reach out to administrators. If a student appears to be in immediate danger, call Public Safety (212-854-5555) or 911. Otherwise, if a student expresses depression, identity struggles, or a re-emergent crisis, console them, then reach out to the Wellness Coordinator right away and submit a Maxient Report; the Wellness Coordinator can connect them with a Wellness Counselor. Don't slip into a 'counseling' role — warning signs you're over your head: the student is crying inconsolably, the conversation passes ~15 minutes, it doesn't reach resolution, or it repeats nightly. Never promise complete confidentiality you can't honor.",
    source: "IBC Residential Life Handbook — Student Emotional Distress",
    tags: ["distress", "emotional", "depressed", "mental health", "wellness coordinator", "counseling", "maxient", "crying", "support"]
  },
  {
    id: "suicidal-ideation",
    category: "Student Support & Wellness",
    title: "Suicide warning signs and who to contact",
    body:
      "Take any concern about suicide very seriously; don't be reluctant to talk about it openly. Red flags include direct or indirect suicidal statements ('everyone would be better off if I died'), talk of 'not being around,' giving away possessions, extreme hopelessness, dramatic personality/hygiene changes, high anger or emotional flattening, reckless behavior, or thinking not grounded in reality. Risk is heightened by past attempts, access to lethal means, family history, social isolation, and recent major stressors. It is not your role to do a clinical assessment — recognize the distress and facilitate a referral. Contact the RD, Wellness Counselor, or Assistant Dean Phong Luu, and avoid offering confidentiality you can't keep.",
    source: "IBC Residential Life Handbook — Student Emotional Distress",
    tags: ["suicide", "suicidal", "self-harm", "ideation", "red flags", "wellness counselor", "phong luu", "RD", "referral"]
  },
  {
    id: "signs-of-distress",
    category: "Student Support & Wellness",
    title: "Recognizing signs of distress",
    body:
      "You may be the first to notice a student in difficulty. Academic indicators: repeated absences, missed assignments, deteriorating or erratic work, writing focused on violence/morbidity/despair, constant requests for special provisions, perfectionism, overblown reactions to grades. Behavioral/emotional indicators: direct statements of distress/family conflict/grief/discrimination, angry outbursts, withdrawal, hopelessness or tearfulness, severe anxiety, demanding or dependent behavior, shakiness or pacing. Physical indicators: decline in appearance/hygiene, exhaustion or falling asleep in class, weight/appetite changes, cuts/bruises/burns, frequent illness, slurred speech, smelling of alcohol. One sign alone may mean little; the more you notice, the more likely help is needed. Trust a gut feeling that something is wrong.",
    source: "IBC Residential Life Handbook — The Many Signs of Distress",
    tags: ["signs", "distress", "indicators", "warning", "withdrawal", "anxiety", "behavior change", "notice"]
  },
  {
    id: "distressed-do-avoid",
    category: "Student Support & Wellness",
    title: "Distressed student — what to do and avoid",
    body:
      "DO: express compassion without intimate friendship; communicate your concern if appropriate; be clear about behavior standards if their behavior disrupts activities; share your intention to refer them for help; and in any psychological or medical emergency, always contact Public Safety. AVOID: taking responsibility for their emotional state ('I'll take care of it for you'), discounting their distress ('it's not that bad'), insisting you're their friend, being overly nurturing, challenging or agreeing with illogical beliefs, or agreeing to maintain confidentiality.",
    source: "IBC Residential Life Handbook — The Distressed Student",
    tags: ["distressed", "do", "avoid", "compassion", "confidentiality", "refer", "support do don't"]
  },
  {
    id: "disruptive-student",
    category: "Student Support & Wellness",
    title: "Handling a disruptive or verbally aggressive student",
    body:
      "DO: remain calm and professional, watch verbal and nonverbal cues, intervene as soon as you see undesirable behavior and be consistent, briefly and directly tell the student the behavior is unacceptable, and if they create a safety risk contact Public Safety or NYPD immediately (use a phone out of sight/hearing or have someone else call). Consult the SPS CARE Team and admin for support. AVOID: waiting too long to seek help, letting the student use you as their only support, giving direct advice, getting defensive, engaging in a power struggle, or responding with anger.",
    source: "IBC Residential Life Handbook — The Disruptive Student",
    tags: ["disruptive", "aggressive", "yelling", "confrontation", "de-escalation", "calm", "power struggle"]
  },
  {
    id: "mediation",
    category: "Student Support & Wellness",
    title: "Conflict resolution and roommate mediation",
    body:
      "Roommate or peer conflicts should be addressed within 24 hours since the program is brief. To prep: collect information, narrow the conflict to those directly involved, update your supervisor, and reserve a private space with a time limit. During: open with ground rules, give each student equal time, let them brainstorm solutions, and review/edit the Roommate Agreement. After: update your supervisor on the outcome, write an Incident Report, and check in on the students within 24–48 hours. Do NOT mediate conflicts involving physical altercations, bias/harassment incidents, or Title IX matters — escalate those to your SRA or RD.",
    source: "IBC Residential Life Handbook — Conflict Resolution/Mediating Students",
    tags: ["mediation", "conflict", "roommate", "dispute", "agreement", "24 hours", "ground rules", "escalate"]
  },

  /* ------------------ INTERN CONDUCT & EMPLOYMENT ----------------- */
  {
    id: "interns-employees",
    category: "Intern Conduct & Employment",
    title: "Interns are employees — conduct and fireable offenses",
    body:
      "Interns are EMPLOYEES of Columbia University, not students; actions that would get a student reprimanded can get an intern dismissed. Any misuse of university property warrants dismissal — for example, throwing a party in the dorm, being disruptively intoxicated, or being disruptive in any way is a fireable offense. Failure to abide by the Intern Agreement, to enforce Behavioral Standards, or to provide for student safety, or any extreme misconduct (hostile/disrespectful behavior, gender-based misconduct) results in immediate dismissal. Mild issues (missed shifts, tardiness, disrespect, lack of engagement) bring a verbal + email warning; repeated instances lead to dismissal. Do NOT drink alcohol or use drugs while on duty, scheduled to work, generally on campus, or with students — if you do, you will be DISMISSED IMMEDIATELY.",
    source: "IBC Residential Life Handbook — Interns are Employees",
    tags: ["fired", "dismissal", "dismissed", "fireable", "employee", "alcohol", "drugs", "party", "warning", "conduct", "terminated"]
  },
  {
    id: "intern-evaluation",
    category: "Intern Conduct & Employment",
    title: "How interns are evaluated (competencies)",
    body:
      "Interns are evaluated on five competencies: Communication (clear, effective, timely updates to supervisors), Community Building (positive inclusive environment, runs programs, uses funds ethically), Planning (backwards planning, self-management, prioritization, anticipating challenges), Collaboration (positive relationships, balanced team contribution, consensus-building), and Professionalism (ethical, mature decisions, appropriate boundaries with students and colleagues). You set goals with your SRA during the Seminar and have a final evaluation at the end of summer.",
    source: "IBC Residential Life Handbook — Intern Evaluation",
    tags: ["evaluation", "competencies", "communication", "professionalism", "planning", "collaboration", "goals", "review", "feedback"]
  },
  {
    id: "p-cards",
    category: "Intern Conduct & Employment",
    title: "Budgets, receipts, and P-Cards",
    body:
      "Program budgets must be proposed and approved by the RD via a program proposal form, and budgets set by the Financial Coordinator and RDs must be upheld. Every P-Card purchase must be followed by immediate receipt submission — photograph each receipt right away and hand it to the Finance Coordinator the same or next business day; a lost receipt requires a missing-receipt form ASAP. Minimize multiple transactions per event. For large purchases, set an appointment with the Finance Coordinator. Notify Finance immediately if a P-Card changes hands. Failing to submit a receipt, losing a P-Card, or lending one without tracking leads to a disciplinary meeting with Associate Director Amanda Díaz.",
    source: "IBC Residential Life Handbook — Budgets, Receipts, and P-Cards",
    tags: ["p-card", "pcard", "receipt", "budget", "finance", "reimbursement", "proposal", "money", "purchase"]
  },
  {
    id: "intern-agreement",
    category: "Intern Conduct & Employment",
    title: "Intern Agreement — key commitments",
    body:
      "The role runs June 8–August 8; you must be available for the full Seminar (training) and Practicum. You may not take on conflicting employment or coursework in that window without the Assistant Director's approval. Practicum participation is contingent on successfully completing the Seminar; the role is at-will employment. Never no-show a shift — telling your supervisor you can't make it does not relieve you of ensuring coverage. All staff work on the 3rd and 4th of July (not available as days off). Interns get about one night off per week if a substitute is available; specific days off aren't guaranteed. No guests in the residence halls. You must move out by 5:00 PM ET on August 8. Columbia does not provide transportation to/from campus.",
    source: "IBC Residential Life Handbook — Intern Agreement",
    tags: ["agreement", "contract", "dates", "july 3", "july 4", "night off", "guests", "move out", "at-will", "commitment"]
  },

  /* ----------------- STUDENT-FACING POLICIES (RA enforces) -------- */
  {
    id: "student-curfew-policy",
    category: "Student Policies (you enforce)",
    title: "Student curfew policy",
    body:
      "Residential students must be in their assigned building by 9:00 PM and inside their assigned dorm room by 11:00 PM on weekdays, and in the building by 10:00 PM and in their room by 12:00 AM on weekends, remaining there overnight. Curfew ends at 6:00 AM. Students may break curfew only while participating in an RA-chaperoned event, and must return to their room immediately once it ends.",
    source: "IBC Residential Life Handbook — Residential or Commuter Specific Policies",
    tags: ["student curfew", "resident", "9pm", "11pm", "policy", "weekend curfew", "enforce"]
  },
  {
    id: "guests-overnight",
    category: "Student Policies (you enforce)",
    title: "Guests and overnight / off-campus requests",
    body:
      "Residential students may not have visitors in the residence halls (including parents, family, classmates, or students from other programs); parents may only help move in/out on the first and last days. To stay off-campus overnight, a parent/legal guardian must submit an Off-Campus Request Form for each instance at least 72 hours in advance, and the program verifies it by direct phone call. Students may stay off-campus no more than 2 nights, limited to one consecutive overnight request per session (e.g., depart Friday after class, return Sunday before evening curfew); non-consecutive requests are denied. Students can only leave and return within curfew hours.",
    source: "IBC Residential Life Handbook — Evenings and Weekends Away",
    tags: ["guest", "visitor", "overnight", "off-campus", "request form", "72 hours", "parent", "sign out", "weekend away"]
  },
  {
    id: "off-campus-passes",
    category: "Student Policies (you enforce)",
    title: "Out-of-boundary / off-campus passes",
    body:
      "Students may leave campus boundaries only for a chaperoned pre-approved excursion, or with an approved Off-Campus Pass. Passes are granted for: medical appointment, practice (athletic/music), miscellaneous appointment, dinner with parents/guardians, or dinner with a family member 25 or older. Except for medical appointments/lessons, students going out of boundaries must be supervised by a family member 25+. Tourism or exploring Manhattan with other pre-college students will not be approved, and students may not sign out with another student's family. A parent/guardian must submit the request at least 72 hours in advance (students may not submit it themselves). Students are limited to two out-of-boundary requests per session. The request form is only open Monday 9:00 AM–Thursday 5:00 PM. Leaving campus without an approved pass is a violation that may lead to dismissal.",
    source: "IBC Residential Life Handbook — Leaving Campus/Out of Boundaries",
    tags: ["off-campus pass", "out of boundaries", "sign out", "permission", "72 hours", "family member 25", "leave campus", "request"]
  },
  {
    id: "commuter-policy",
    category: "Student Policies (you enforce)",
    title: "Commuter student policies",
    body:
      "Commuter and online students are not permitted to enter the residence halls under any non-public-safety circumstance, and commuter students must leave campus daily by 6:30–7:00 PM. Commuters not staying in their primary residence attest they will live somewhere with direct adult (family or family-friend) supervision — not in a hotel, Airbnb, hostel, or other unsupervised housing.",
    source: "IBC Residential Life Handbook — Campus Access / Commuter Accommodations",
    tags: ["commuter", "leave campus", "6:30", "7pm", "dorm access", "online", "supervision"]
  },
  {
    id: "behavioral-standards",
    category: "Student Policies (you enforce)",
    title: "Student behavioral standards",
    body:
      "Students must uphold respect, integrity, and civility. Prohibited conduct includes discrimination or demeaning others based on protected categories; disruptive, disorderly, lewd, or indecent behavior; misusing or damaging university property/software; failure to comply with a University official or law enforcement; and harassment (unwelcome conduct that significantly interferes with someone's work, education, or living conditions). Alcohol violations (possession/use under 21, fake IDs, providing alcohol to minors, drinking games), illegal-drug and paraphernalia violations, and smoking violations (no indoor smoking; none within 20 feet of buildings; no smoking devices in residence halls) are all prohibited. Serious first offenses can result in immediate dismissal; dismissed students receive no tuition refund and must depart immediately.",
    source: "IBC Residential Life Handbook — Behavioral Standards",
    tags: ["behavioral standards", "rules", "alcohol", "drugs", "smoking", "harassment", "discrimination", "dismissal", "student conduct"]
  },
  {
    id: "academic-standards",
    category: "Student Policies (you enforce)",
    title: "Academic standards (plagiarism, dishonesty)",
    body:
      "Academic misconduct is among the most serious offenses. Dishonesty (falsifying or misrepresenting information to gain unfair advantage, fabricating credentials, providing false information to be excused), plagiarism (submitting others' work, failing to cite sources, not quoting borrowed phrases, reusing the same assignment for two courses without permission), self-plagiarism, and the unauthorized taking/sharing of course materials (photos, screenshots, uploads to CourseHero/Chegg/GitHub, recording lectures) are all prohibited.",
    source: "IBC Residential Life Handbook — Academic Standards",
    tags: ["academic", "plagiarism", "cheating", "dishonesty", "misconduct", "coursehero", "integrity"]
  },

  /* ------------------------- PROGRAMMING -------------------------- */
  {
    id: "group-programs",
    category: "Programming",
    title: "Group programs and in-building programs",
    body:
      "Each intern must hold a minimum of ONE group program within the first week (specific to your assigned students; can be done with a co-RA) — examples include games, themed lunches, team escape rooms, and cookie decorating. Interns must also host a minimum of THREE in-dorm programs per session — about one per week, held later in the day but before curfew. Of those three, one should be educational/college-prep and two should be community-building. Programs can be run in collaboration with other RAs in your building.",
    source: "IBC Residential Life Handbook — Programming Model",
    tags: ["program", "programming", "group program", "in-building", "in-dorm", "how many programs", "event", "activity"]
  },
  {
    id: "program-ideas",
    category: "Programming",
    title: "Program ideas",
    body:
      "Educational in-building program ideas: communication/social skills, study habits and time management, community service, networking, campus resources, roommate relationships, current events, personal safety, financial management, bystander intervention, health and fitness, choosing/changing a major, self-advocacy, and learning about difference. Community-building ideas: karaoke, arts/crafts, poetry, music jam sessions, yoga/Zumba, movie night, ice cream social, board game night, and tote-bag decorating. Program-wide events you may help lead include the Student Life Extravaganza, Talent Show, Dance Party, Karaoke Night, and Murder Mystery Dinner. Common student clubs include Film & Media, LGBTQIA+ Alliance, Multicultural Club, Gaming Club, Creative Collective, Asian Student Union, and Student Activism.",
    source: "IBC Residential Life Handbook — Programming / Cross-Cultural Community Building",
    tags: ["program ideas", "activities", "clubs", "events", "movie night", "karaoke", "talent show", "ice cream", "what to do"]
  },

  /* ------------------- DATES & PROGRAM STRUCTURE ------------------ */
  {
    id: "program-structure",
    category: "Dates & Structure",
    title: "Summer 2026 program structure and session dates",
    body:
      "The internship has a 2-week Training Seminar (June 8–June 18) and a 6-week Practicum. Sessions: Commuter Session AA June 22–26; Residential Session A June 28–July 17/18; Residential Session B July 20–August 7/8; Commuter Session C August 3–August 7. The Seminar blends core-skills and university-policy training with conflict-resolution practice and community building; the Practicum is when interns work within their Residence Life teams with students.",
    source: "IBC Residential Life Handbook — Summer Overview",
    tags: ["dates", "schedule", "seminar", "practicum", "session a", "session b", "structure", "calendar", "when"]
  },
  {
    id: "move-in",
    category: "Dates & Structure",
    title: "Move-in / check-in dates and your role",
    body:
      "Session A residential students move in (with orientation and BBQ) on June 28; Session A commuter check-in is June 29. Session B residential move-in is July 20; Session B commuter check-in is July 21. Wear your program t-shirt on residential move-in days and your program polo on commuter check-in days. On move-in you'll either work a shift or welcome families in your building's common area — be ready to answer questions or refer to your SRA/RD. Your first floor meeting is after dinner and the campus tour at 9:00 PM ET (have an agenda and an icebreaker ready). 24 hours after move-in, Associate Director Amanda Díaz will contact you about any students who didn't move in — you must respond. If a parent asks for your cell number, decline and give them the Student Services office number.",
    source: "IBC Residential Life Handbook — Move-In/Check-In",
    tags: ["move-in", "movein", "check-in", "june 28", "july 20", "orientation", "bbq", "first floor meeting", "t-shirt", "polo", "parents"]
  },
  {
    id: "move-out",
    category: "Dates & Structure",
    title: "Move-out dates and your role",
    body:
      "Session A residential move-out is July 17–18; Session B is August 7–8. Students must pack and move out by 9:00 PM on Friday July 18 and Friday August 8, and may begin checking out after their last class (most are dismissed by 3:00 PM; a smaller group finishes at 5:00 PM). RAs collect linens from each student, check each room for cleanliness and damages, and check the student out on the move-out roster. You're dismissed from the shift after your last student has moved out.",
    source: "IBC Residential Life Handbook — Move-Out",
    tags: ["move-out", "moveout", "checkout", "july 18", "august 8", "linens", "room check", "roster", "end of session"]
  },
  {
    id: "graduation",
    category: "Dates & Structure",
    title: "IBC graduation / celebration",
    body:
      "In the final week of the summer, graduation is a time to recognize everyone's hard work. Attendance is required so the program can celebrate you.",
    source: "IBC Residential Life Handbook — IBC Graduation/Celebration",
    tags: ["graduation", "celebration", "end", "ceremony", "final week", "required"]
  },

  /* ----------------------- COMMUNICATION -------------------------- */
  {
    id: "communication-channels",
    category: "Communication",
    title: "How the program communicates (Canvas, Lionmail, GroupMe)",
    body:
      "The IBC uses several channels. Canvas holds all handbooks, protocols, training decks, resources, forms, and links (download the Canvas app for notifications). Lionmail (Columbia email) is the main campus-wide channel — check it at least twice daily. GroupMe text blasts share urgent info; keep notifications on and check frequently when not on a day off. Weekly staff meetings are the most important flow of information. Answer all phone calls, even from unknown numbers, as it may be an emergency.",
    source: "IBC Residential Life Handbook — Staff Communication and Information",
    tags: ["communication", "canvas", "lionmail", "email", "groupme", "staff meeting", "channels", "notifications"]
  },
  {
    id: "groupme-channels",
    category: "Communication",
    title: "GroupMe channels and what each is for",
    body:
      "GroupMe channels: 'IBC 2026 / All Staff' for full-group announcements and questions; 'Health' to announce when a student is taken to the Health Center/Hospital and when they return; 'Photos' to post captioned pictures from programs and group meetings; 'Excursions' for major-excursion info, travel delays, and open excursion spots; 'Floaters' to request floater help (floaters post availability and priority tasks); and a Building-Specific channel for each residence hall's announcements and questions.",
    source: "IBC Residential Life Handbook — GroupMe Channels",
    tags: ["groupme", "channels", "health channel", "photos", "excursions", "floaters", "building", "text"]
  },
  {
    id: "escalation",
    category: "Communication",
    title: "Who to ask — the escalation chain",
    body:
      "For low-level questions, call your Senior Resident Assistant (SRA) first, or try to reach 'the right voice' for that functional area; it's always better to ask than to fake it. For concerns beyond your SRA, connect with your Resident Director (RD); if unresolved, contact the Assistant Director (Jeannette Sanchez); you may escalate to the Director after trying the RD and AD. For general internship inquiries, email the office alias ibc@columbia.edu. For HR/payroll, submit a ticket with SPS HR. The program's motto for concerns is 'Complaints go up' — put growing concerns in writing via the General Concerns Report Form so leaders can track and follow up.",
    source: "IBC Residential Life Handbook — Escalated Concerns / Sharing Information",
    tags: ["who to ask", "escalation", "SRA", "RD", "assistant director", "director", "complaints go up", "ibc@columbia.edu", "hr", "question"]
  },

  /* --------------------------- SELF-CARE -------------------------- */
  {
    id: "self-care",
    category: "Self-Care & Time Off",
    title: "Self-care strategies",
    body:
      "The IBC is physically demanding, so be deliberate about sleep, food, and pacing. Sleep: aim for 8 hours; designate two weeknights as 'in bed by 11:30 PM' nights; try for up to 5 naps a week. Eat well: choose fruit, salads, and the healthier options at Ferris Booth. Hydrate: drink plenty of water (skip sugary soda/sports drinks), even on cooler days. Downtime: keep doing the activities that recharge you (gym, reading, sports, yoga, writing), give yourself alone time, and don't run a late-night excursion before an early morning. Avoid getting drunk on nights off — it's like missing a whole night of sleep.",
    source: "IBC Residential Life Handbook — Self-Care Strategies",
    tags: ["self care", "sleep", "rest", "nap", "burnout", "tired", "hydrate", "wellbeing", "pacing", "energy"]
  },
  {
    id: "nights-off",
    category: "Self-Care & Time Off",
    title: "Nights off",
    body:
      "Interns get at least one designated night off per week to step back and focus on themselves; another RA covers your curfew checks. Submit your request to your SRA or RD, and once approved, make sure you have no assigned shifts that day — it is your responsibility to find coverage. Specific days off are not guaranteed and depend on a substitute being available.",
    source: "IBC Residential Life Handbook — Intern Nights Off",
    tags: ["night off", "day off", "time off", "coverage", "request", "break", "weekly"]
  },
  {
    id: "ability-to-thrive",
    category: "Self-Care & Time Off",
    title: "Support if you're struggling (Ability to Thrive)",
    body:
      "If you're struggling with personal or health problems, you can talk with your SRA, RD, Jeannette, or Phong about your needs. You should not feel compelled to do work you're not physically capable of due to disability or illness. Mental health matters as much as physical health — if you feel overwhelmed, anxious, or emotionally exhausted, speak to someone; you don't have to manage it alone. Burn-out moments are normal; reach out and the program will do its best to help. Staff with an accessibility need should contact HR with documentation.",
    source: "IBC Residential Life Handbook — Ability to Thrive",
    tags: ["struggling", "support", "mental health", "accommodation", "disability", "overwhelmed", "help", "thrive", "burnout"]
  },

  /* --------------------- GETTING STARTED / LOGISTICS -------------- */
  {
    id: "uni-lionmail",
    category: "Getting Started",
    title: "Your UNI and LionMail account",
    body:
      "Your UNI (University Network Identification) is your Columbia ID code and the basis of your CU email address; many offices ask for it to verify your affiliation, so know it by heart. You must use your Columbia account when communicating as a University representative. Activate it at www.columbia.edu/acis/create (click 'UNI,' then 'Activate UNI or Email,' and accept the network agreements). Forgot your password? Use cuit.columbia.edu/cuit/manage-my-uni and click 'Forgot My Password.' If you've had a UNI before, you don't need a new one.",
    source: "IBC Residential Life Handbook — UNI and LionMail Account",
    tags: ["uni", "lionmail", "email", "account", "password", "activate", "login", "columbia email"]
  },
  {
    id: "residence-dining-laundry",
    category: "Getting Started",
    title: "Your room, dining, and laundry",
    body:
      "Every RA gets a room on Morningside campus for Seminar and Practicum; whether in a suite- or corridor-style hall, RAs have no roommate in their bedroom but share common bathrooms and lounges. Guests are not allowed in the residence halls for the duration of the program (friends/family may help with move-in/out only). Dining is at the Ferris Booth Dining Hall in Lerner Student Center; email Associate Director Amanda Díaz (ad3566@columbia.edu) about allergy or dining issues. Laundry machines are free in the basement of the residence halls, but you provide your own detergent.",
    source: "IBC Residential Life Handbook — Residence Halls / Dining / Laundry",
    tags: ["room", "dorm", "dining", "ferris booth", "laundry", "lerner", "no guests", "meals", "food"]
  },
  {
    id: "postal-mail",
    category: "Getting Started",
    title: "Postal mail address",
    body:
      "The program's postal address is: INTERN/STUDENT NAME, c/o Pre-College Program, Uris Hall – 3022 Broadway, New York, NY 10027, Room 105, New York, NY 10027-6902. Reserve mailing to the office for emergencies only — the campus mail office has significant delays and on-time delivery isn't guaranteed; buy items in store when possible.",
    source: "IBC Residential Life Handbook — Postal Mail",
    tags: ["mail", "package", "address", "uris hall", "broadway", "shipping", "delivery"]
  },
  {
    id: "disability-services",
    category: "Getting Started",
    title: "Disability and accessibility services",
    body:
      "The program often has students with disabilities, and programming should be made available to all students with accommodations as necessary. For any problems, worries, or questions, call Coordinator Yeiny Moreno Cabral, who serves as the Disabilities Liaison. A staff member with an accessibility need should contact HR to describe the accommodation and provide documentation.",
    source: "IBC Residential Life Handbook — Disability Services",
    tags: ["disability", "accessibility", "accommodation", "yeiny", "liaison", "ADA", "support"]
  },

  /* ------------------------- KEY PEOPLE --------------------------- */
  {
    id: "leadership-admins",
    category: "People & Roles",
    title: "Program administrators and how to reach them",
    body:
      "Program administrators include: Phong Luu, Assistant Dean of Student Affairs; Josh Alexander, Associate Dean of Student Affairs; Amanda Díaz, Interim Director / Associate Director (ad3566@columbia.edu; also the dining/allergy contact); Cameron Collichio, Associate Director (cc4072@columbia.edu); Jeannette Sanchez, Assistant Director (js4394@columbia.edu; broadly available for intern support and Health Services questions); Kwesi Alleyne, Assistant Director of Student Engagement (ka2155@columbia.edu); and Yeiny Moreno Cabral, Coordinator of Student Affairs (ym2964@columbia.edu; Disabilities Liaison). For general inquiries, email ibc@columbia.edu. There are also Resident Directors and a Coordinator team (Programming, Student Services, Finance, Housing, Conduct, Wellness).",
    source: "IBC Residential Life Handbook — Program Administrators / Leadership",
    tags: ["admin", "leadership", "phong luu", "amanda diaz", "jeannette sanchez", "kwesi", "yeiny", "contact", "who is", "director", "email"]
  },
  {
    id: "resident-directors",
    category: "People & Roles",
    title: "Resident Directors (RDs) and offices",
    body:
      "Resident Directors include Manley Francois (Senior Resident Director, mf3586@columbia.edu, Uris 318), Saily Fernandez (John Jay 501, sf3160@columbia.edu), Kay Zakarin (Carman M02A, kz2636@columbia.edu), Rebekah Walker (rw3215@columbia.edu), and Geanpaul Ojeda (Visiting RD, go2325@columbia.edu). Residential Life offices are on the John Jay 5th floor and the Carman Hall mezzanine; Pre-College administrators are in Uris Hall (rooms 105, 111, 316, and 324 suites).",
    source: "IBC Residential Life Handbook — Resident Directors / Office Locations",
    tags: ["resident director", "RD", "manley", "saily", "kay zakarin", "rebekah walker", "geanpaul", "office", "john jay", "carman", "uris"]
  },
  {
    id: "sra-role",
    category: "People & Roles",
    title: "What a Senior Resident Assistant (SRA) does",
    body:
      "Your SRA is your IBC Team Leader, in charge of a team of about 8–11 RAs, and your first resource for questions about policies, caring for your students, or program logistics. The Programming & Residential Life Assistant cohort is made up of 17 Senior Resident Assistants and 130 Resident Assistants. Your SRA holds weekly one-on-one meetings with you and helps set and review your goals.",
    source: "IBC Residential Life Handbook — Senior Resident Assistants: Your IBC Team Leaders",
    tags: ["sra", "senior resident assistant", "team leader", "supervisor", "one-on-one", "8 to 11", "17 sras", "130 ras"]
  },
  {
    id: "program-overview",
    category: "People & Roles",
    title: "About the IBC and the Pre-College Program",
    body:
      "The Internship in Building Community (IBC) provides a dedicated, specially trained residential life staff for Columbia's Summer Pre-College Programs (the High School Summer Program). Sessions are three weeks or one week; courses are non-credit but college-level, meeting roughly two hours each morning and afternoon. Since its first cohort of ~40 interns, the IBC has grown to more than 1,500 alumni and will welcome about 125 'IBCers' in 2026. The program sits within Columbia's School of Professional Studies (SPS). A core idea of the role: 'authority' means 'having command of information' — interns who ask lots of questions in turn have lots of answers.",
    source: "IBC Residential Life Handbook — Overview & History",
    tags: ["ibc", "about", "pre-college", "high school program", "sps", "history", "125", "alumni", "what is", "overview"]
  },

  /* ------------------- TRAINING GROUP ASSIGNMENTS ----------------- */
  {
    id: "bcd-training-overview",
    category: "Training Groups",
    title: "BCD (de-escalation) scenario training — when and where",
    body:
      "Behavioral Conduct & De-escalation (BCD) scenario training takes place in Carman Hall from 1:00–3:30 PM. Group 1 is Tuesday, June 16; Group 2 is Wednesday, June 17. Within each group, RAs are split into Scenarios 1–6, each led by a set of SRAs. Check your scenario assignment on the BCD Groups roster to know which scenario station to report to.",
    source: "IBC 2026 BCD Groups",
    tags: ["bcd", "training", "de-escalation", "scenario", "carman", "june 16", "june 17", "group 1", "group 2", "behavioral conduct"]
  },
  {
    id: "bcd-group-2",
    category: "Training Groups",
    title: "BCD Group 2 (Wednesday, June 17) roster",
    body:
      "BCD Group 2 meets Wednesday, June 17 in Carman Hall, 1:00–3:30 PM. SRAs leading: Julian, Eric, Marcus, Vicky, Jonathan V., Gracie, Ian, Juan, Selina. Scenario 2 RAs include Nawshin Tasnim, Alejandro Simon, Isabel Corona, Jason Dhawan, Lauren Sullo, Denny Weng, Justin Mena, Carolyn Place, and Bishop Switzer. (Group 1 meets Tuesday, June 16 at the same time and place.)",
    source: "IBC 2026 BCD Groups",
    tags: ["bcd", "group 2", "june 17", "scenario 2", "bishop switzer", "roster", "carman", "wednesday"]
  },
  {
    id: "cpr-training-overview",
    category: "Training Groups",
    title: "CPR/AED certification training — when and where",
    body:
      "CPR/AED training is held in the Lerner Satow Room (Floor 5) on Tuesday, June 16 and Wednesday, June 17, in timed groups of 20–30 slots: Group 1 (Tue) 8:00–11:00 AM, Group 2 (Tue) 11:30 AM–2:30 PM, Group 3 (Tue) 3:00–6:00 PM, Group 4 (Wed) 8:00–11:00 AM, Group 5 (Wed) 11:30 AM–2:30 PM, and Group 6 (Wed) 3:00–6:00 PM. Check the CPR/AED Groups roster for your assigned group and time, and arrive on time since slots are limited.",
    source: "IBC 2026 CPR/AED Training Groups",
    tags: ["cpr", "aed", "first aid", "certification", "lerner", "satow", "june 16", "june 17", "training", "time slot"]
  },
  {
    id: "cpr-group-2",
    category: "Training Groups",
    title: "CPR/AED Group 2 (Tuesday, June 16, 11:30 AM–2:30 PM)",
    body:
      "CPR/AED Group 2 meets Tuesday, June 16 in the Lerner Satow Room (Floor 5) from 11:30 AM–2:30 PM (30 slots). Assigned RAs include Juliana Lucas, Oscar Johnson, Yneliz De Jesus, Sara Roger-Gordon, Hamza Malik, Isaias Santiago, Mayer Tawfik, Hasan Sackor, Nawshin Tasnim, Alejandro Simon, Isabel Corona, Jason Dhawan, Lauren Sullo, Denny Weng, Justin Mena, Carolyn Place, Bishop Switzer, and others.",
    source: "IBC 2026 CPR/AED Training Groups",
    tags: ["cpr", "aed", "group 2", "june 16", "11:30", "satow", "bishop switzer", "tuesday", "roster"]
  }
];
