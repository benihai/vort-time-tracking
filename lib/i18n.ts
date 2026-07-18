// Lightweight i18n. English is the default; Hebrew is a toggle. Direction
// flips with the language (en -> ltr, he -> rtl).

export type Lang = "en" | "he";

export const DEFAULT_LANG: Lang = "en";

export function dirFor(lang: Lang): "rtl" | "ltr" {
  return lang === "he" ? "rtl" : "ltr";
}

type Dict = Record<string, string>;

const en: Dict = {
  // brand / login
  "app.title": "Vort — Work Hours",
  "login.headline": "Report hours.",
  "login.tagline": "Simple, fast, precise. From clock-in to payroll.",
  "login.brandFooter": "Vort · Work Hours",
  "login.title": "Sign in",
  "login.intro": "Enter the credentials you got from your admin.",
  "login.email": "Email",
  "login.password": "Password",
  "login.submit": "Log in",
  "login.submitting": "Signing in…",
  "login.error": "Wrong email or password.",

  // roles / header
  "role.admin": "Admin",
  "role.employee": "Employee",
  "header.signout": "Sign out",
  "header.user": "User",
  "nav.log": "Log hours",
  "nav.myReports": "My reports",
  "nav.allReports": "All reports",
  "nav.users": "Users",
  "lang.switchTo": "עברית",

  // dashboard
  "dash.greeting": "Hello, {name} 👋",
  "dash.greetingNoName": "Hello 👋",
  "dash.subtitle": "What did you work on today?",
  "stat.today": "Hours today",
  "stat.month": "Hours this month",
  "stat.entries": "Entries this month",
  "stat.hours": "hours",
  "stat.records": "records",

  // log form
  "form.title": "New entry",
  "form.date": "Date",
  "form.dateHint": "Future dates can't be selected.",
  "form.start": "Start time",
  "form.end": "End time",
  "form.total": "Total:",
  "form.hours": "hours",
  "form.description": "Work description",
  "form.descriptionPlaceholder": "What did you work on?",
  "form.save": "Save entry",
  "form.saving": "Saving…",
  "form.success": "Entry saved successfully.",
  "form.editTitle": "Edit entry",
  "form.saveChanges": "Save changes",
  "form.cancel": "Cancel",
  "form.updated": "Entry updated.",
  "time.hh": "HH",
  "time.mm": "MM",

  // validation (also returned by the server, keyed by cookie lang)
  "err.required": "Please fill in date, start time and end time.",
  "err.future": "You can't log hours for a future date.",
  "err.order": "End time must be later than start time.",
  "err.timeFormat": "Please enter a valid time (HH:MM, 24-hour).",
  "err.overlap": "There's already an overlapping entry on this date.",
  "err.invalid": "The values entered are invalid.",
  "err.saveFailed": "Save failed. Please try again.",
  "err.notAuth": "You're not signed in. Please sign in again.",
  "err.deleteFailed": "Delete failed.",

  // recent / lists
  "recent.title": "Recent entries",
  "recent.empty": "No entries yet — start above.",
  "recent.confirmDelete": "Delete this entry?",
  "recent.delete": "Delete",
  "recent.edit": "Edit",

  // history
  "history.title": "My reports",
  "history.subtitle": "Pick a month to see all its entries.",
  "history.month": "Month",
  "history.empty": "No entries for this month.",
  "history.total": "Monthly total",

  // table headers
  "th.employee": "Employee",
  "th.role": "Role",
  "th.date": "Date",
  "th.hours": "Hours",
  "th.total": "Total",
  "th.description": "Description",

  // admin timesheet
  "admin.title": "All reports",
  "admin.subtitle": "Every entry in the system — filter and export for payroll.",
  "filter.title": "Filter",
  "filter.employee": "Employee",
  "filter.allEmployees": "All employees",
  "filter.role": "Role",
  "filter.all": "All",
  "filter.from": "From date",
  "filter.to": "To date",
  "filter.clear": "Clear filters",
  "admin.entriesCount": "{n} entries",
  "admin.totalHours": "Total {h} hours",
  "admin.export": "Export CSV",
  "admin.tableEmpty": "No entries match the current filter.",

  // users
  "users.title": "Users",
  "users.subtitle": "Create accounts, set role and initial password.",
  "users.newTitle": "New user",
  "users.fullName": "Full name",
  "users.fullNamePlaceholder": "Noa Levi",
  "users.email": "Email",
  "users.password": "Initial password",
  "users.passwordHint": "At least 6 characters. The user can change it later.",
  "users.passwordPlaceholder": "Temporary password",
  "users.role": "Role",
  "users.create": "Create user",
  "users.creating": "Creating…",
  "users.listTitle": "Users in the system",
  "users.noName": "No name",
  "users.created": "User {name} created successfully.",
  "users.edit": "Edit",
  "users.editTitle": "Edit user",
  "users.newPassword": "New password",
  "users.newPasswordHint": "Leave blank to keep the current password.",
  "users.save": "Save changes",
  "users.cancel": "Cancel",
  "users.saving": "Saving…",
  "users.updated": "{name} updated.",
  "users.errNotFound": "User not found.",
  "users.errName": "Please enter a full name.",
  "users.errEmail": "Invalid email address.",
  "users.errPassword": "Password must be at least 6 characters.",
  "users.errExists": "This email already exists.",
  "users.errFailed": "Failed to create the user.",
  "users.errNoKey":
    "The service key (SUPABASE_SERVICE_ROLE_KEY) is not set on the server. Update .env.local.",
  "users.errForbidden": "You don't have permission for this action.",
  "users.errBadRequest": "Invalid request.",

  // csv
  "csv.employee": "Employee",
  "csv.role": "Role",
  "csv.date": "Date",
  "csv.start": "Start",
  "csv.end": "End",
  "csv.hoursDecimal": "Hours (decimal)",
  "csv.hoursHM": "Hours (h:mm)",
  "csv.description": "Description",
};

const he: Dict = {
  "app.title": "Vort — דיווח שעות",
  "login.headline": "דיווח שעות.",
  "login.tagline": "פשוט, מהיר, מדויק. מתחילת המשמרת ועד גיליון השכר.",
  "login.brandFooter": "Vort · דיווח שעות עבודה",
  "login.title": "התחברות",
  "login.intro": "הזינו את פרטי הכניסה שקיבלתם מהמנהל.",
  "login.email": "אימייל",
  "login.password": "סיסמה",
  "login.submit": "כניסה",
  "login.submitting": "מתחבר…",
  "login.error": "אימייל או סיסמה שגויים.",

  "role.admin": "מנהל",
  "role.employee": "עובד",
  "header.signout": "התנתקות",
  "header.user": "משתמש",
  "nav.log": "דיווח",
  "nav.myReports": "הדיווחים שלי",
  "nav.allReports": "כל הדיווחים",
  "nav.users": "ניהול משתמשים",
  "lang.switchTo": "English",

  "dash.greeting": "שלום, {name} 👋",
  "dash.greetingNoName": "שלום 👋",
  "dash.subtitle": "על מה עבדת היום?",
  "stat.today": "שעות היום",
  "stat.month": "שעות החודש",
  "stat.entries": "דיווחים החודש",
  "stat.hours": "שעות",
  "stat.records": "רשומות",

  "form.title": "דיווח חדש",
  "form.date": "תאריך",
  "form.dateHint": "לא ניתן לבחור תאריך עתידי.",
  "form.start": "שעת התחלה",
  "form.end": "שעת סיום",
  "form.total": "סה״כ:",
  "form.hours": "שעות",
  "form.description": "תיאור העבודה",
  "form.descriptionPlaceholder": "על מה עבדת?",
  "form.save": "שמירת דיווח",
  "form.saving": "שומר…",
  "form.success": "הדיווח נשמר בהצלחה.",
  "form.editTitle": "עריכת דיווח",
  "form.saveChanges": "שמירת שינויים",
  "form.cancel": "ביטול",
  "form.updated": "הדיווח עודכן.",
  "time.hh": "שעה",
  "time.mm": "דקה",

  "err.required": "יש למלא תאריך, שעת התחלה ושעת סיום.",
  "err.future": "לא ניתן לדווח שעות על תאריך עתידי.",
  "err.order": "שעת הסיום חייבת להיות מאוחרת משעת ההתחלה.",
  "err.timeFormat": "יש להזין שעה תקינה (HH:MM, פורמט 24 שעות).",
  "err.overlap": "קיים כבר דיווח חופף בתאריך זה.",
  "err.invalid": "הערכים שהוזנו אינם תקינים.",
  "err.saveFailed": "השמירה נכשלה. נסו שוב.",
  "err.notAuth": "אינך מחובר. התחבר מחדש.",
  "err.deleteFailed": "המחיקה נכשלה.",

  "recent.title": "דיווחים אחרונים",
  "recent.empty": "עדיין אין דיווחים — התחילו למעלה.",
  "recent.confirmDelete": "למחוק את הדיווח?",
  "recent.delete": "מחיקה",
  "recent.edit": "עריכה",

  "history.title": "הדיווחים שלי",
  "history.subtitle": "בחרו חודש כדי לראות את כל הדיווחים שלו.",
  "history.month": "חודש",
  "history.empty": "אין דיווחים לחודש זה.",
  "history.total": "סה״כ החודש",

  "th.employee": "עובד",
  "th.role": "תפקיד",
  "th.date": "תאריך",
  "th.hours": "שעות",
  "th.total": "סה״כ",
  "th.description": "תיאור",

  "admin.title": "כל הדיווחים",
  "admin.subtitle": "כל הדיווחים במערכת — סינון וייצוא לשכר.",
  "filter.title": "סינון",
  "filter.employee": "עובד",
  "filter.allEmployees": "כל העובדים",
  "filter.role": "תפקיד",
  "filter.all": "הכל",
  "filter.from": "מתאריך",
  "filter.to": "עד תאריך",
  "filter.clear": "ניקוי סינון",
  "admin.entriesCount": "{n} דיווחים",
  "admin.totalHours": "סה״כ {h} שעות",
  "admin.export": "ייצוא ל‑CSV",
  "admin.tableEmpty": "אין דיווחים להצגה עבור הסינון הנוכחי.",

  "users.title": "ניהול משתמשים",
  "users.subtitle": "יצירת חשבונות, קביעת תפקיד וסיסמה ראשונית.",
  "users.newTitle": "משתמש חדש",
  "users.fullName": "שם מלא",
  "users.fullNamePlaceholder": "נועה לוי",
  "users.email": "אימייל",
  "users.password": "סיסמה ראשונית",
  "users.passwordHint": "לפחות 6 תווים. העובד יוכל לשנות בהמשך.",
  "users.passwordPlaceholder": "סיסמה זמנית",
  "users.role": "תפקיד",
  "users.create": "יצירת משתמש",
  "users.creating": "יוצר…",
  "users.listTitle": "משתמשים במערכת",
  "users.noName": "ללא שם",
  "users.created": "המשתמש {name} נוצר בהצלחה.",
  "users.edit": "עריכה",
  "users.editTitle": "עריכת משתמש",
  "users.newPassword": "סיסמה חדשה",
  "users.newPasswordHint": "השאירו ריק כדי לא לשנות את הסיסמה.",
  "users.save": "שמירת שינויים",
  "users.cancel": "ביטול",
  "users.saving": "שומר…",
  "users.updated": "המשתמש {name} עודכן.",
  "users.errNotFound": "המשתמש לא נמצא.",
  "users.errName": "יש להזין שם מלא.",
  "users.errEmail": "כתובת אימייל לא תקינה.",
  "users.errPassword": "הסיסמה חייבת להכיל לפחות 6 תווים.",
  "users.errExists": "אימייל זה כבר קיים במערכת.",
  "users.errFailed": "יצירת המשתמש נכשלה.",
  "users.errNoKey":
    "מפתח השירות (SUPABASE_SERVICE_ROLE_KEY) לא הוגדר בשרת. עדכנו את .env.local.",
  "users.errForbidden": "אין לך הרשאה לפעולה זו.",
  "users.errBadRequest": "בקשה לא תקינה.",

  "csv.employee": "עובד",
  "csv.role": "תפקיד",
  "csv.date": "תאריך",
  "csv.start": "שעת התחלה",
  "csv.end": "שעת סיום",
  "csv.hoursDecimal": "שעות (עשרוני)",
  "csv.hoursHM": "שעות (ש:ד)",
  "csv.description": "תיאור",
};

const dicts: Record<Lang, Dict> = { en, he };

/** Translate `key` for `lang`, interpolating {vars}. Falls back to the key. */
export function t(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>
): string {
  let s = dicts[lang]?.[key] ?? dicts[DEFAULT_LANG][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return s;
}
