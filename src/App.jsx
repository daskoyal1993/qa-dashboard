import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

export default function App() {

  const [preview, setPreview] = useState("");
  const [token, setToken] = useState(null);

  const [form, setForm] = useState({

    testerEmail: "",

    offerLink: "",
    testLink: "",

    crmUrl: "",
    crmUsername: "",
    crmPassword: "",

    everflowUrl: "",
    everflowUsername: "",
    everflowPassword: "",
    apiId: "",

    visa: "",
    master: "",
    prepaid: "",

    visaDecline: "",
    binVisaDecline: "",
    binMasterRebill: "",
    binVisaInitial: "",
    binMasterInitialDecline: "",

    generalInstructions: "",
    fileCheckingInstructions: "",

    check1Cid: "",
    check1Pid: "",

    check2Cid: "",
    check2Pid: "",

    check3Cid: "",
    check3Pid: "",

    check4Cid: "",
    check4Pid: "",

    check5Cid: "",
    check5Pid: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = useGoogleLogin({

    scope: "https://www.googleapis.com/auth/gmail.send",

    onSuccess: (tokenResponse) => {

      setToken(tokenResponse.access_token);

      alert("Google Login Success");
    },

    onError: () => {

      alert("Google Login Failed");
    },
  });

  const generateEmail = () => {

    const email = `
Hello Team,

Please test only the order flow.

Live Offer Link : ${form.offerLink}

Test Link : ${form.testLink}

CRM Login Details:
${form.crmUrl}
${form.crmUsername}
${form.crmPassword}

Card Details:

Visa : ${form.visa}
Master : ${form.master}
Prepaid : ${form.prepaid}

Visa Decline : ${form.visaDecline}

Bin Visa Decline : ${form.binVisaDecline}
Bin Master (Rebill) : ${form.binMasterRebill}
Bin Visa (Initial) : ${form.binVisaInitial}
Bin Master(Initial) Decline : ${form.binMasterInitialDecline}

Everflow Login Details:
${form.everflowUrl}
${form.everflowUsername}
${form.everflowPassword}

API ID : ${form.apiId}

General Instructions:
${form.generalInstructions}

File Checking Instructions:
${form.fileCheckingInstructions}

1st checking ==>

On first attempt place an order with Visa Decline card a decline order will get generated with Main Visa CID & PID, after the error message is displayed attempt with the same card another decline order will get generated with CID ${form.check1Cid} and PID ${form.check1Pid} and redirect to google.com


2nd checking ==>

On first attempt place an order with Bin Visa Decline a decline order will get generated with BIN Visa CID & PID, after the error message is displayed attempt with normal Visa card two success order will get generated one with CID ${form.check2Cid} and PID ${form.check2Pid}, CID 2 and PID 12 & CID 9 and PID 34


3rd checking ==>

Place an order with Bin Master (Rebill) card two success order will get generated one with CID ${form.check3Cid} and PID ${form.check3Pid} & another with CID 2 and PID 13


4th checking ==>

Place an order with Bin Visa (Initial) card two success order will get generated one with CID ${form.check4Cid} and PID ${form.check4Pid} & another with CID 2 and PID 33


5th checking ==>

Place an order with Bin Master(Initial) Decline card one decline order will get generated one with CID ${form.check5Cid} and PID ${form.check5Pid}, after the error message is displayed attempt with the same card another decline order will get generated with CID 861 and PID 422 and redirect to google.com

`;

    setPreview(email);
  };

  const exportTXT = () => {

    const blob = new Blob([preview], {
      type: "text/plain;charset=utf-8",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "qa-email.txt";

    link.click();
  };

  const exportHTML = () => {

    const htmlContent = `
    <html>
      <body>
        <pre>${preview}</pre>
      </body>
    </html>
    `;

    const blob = new Blob([htmlContent], {
      type: "text/html;charset=utf-8",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "qa-email.html";

    link.click();
  };

  const copyEmail = async () => {

    await navigator.clipboard.writeText(preview);

    alert("Email copied successfully!");
  };

  const sendEmail = async () => {

    if (!token) {

      alert("Please login with Google first");

      return;
    }

    const email = [
      `To: ${form.testerEmail}`,
      "Subject: QA Testing Email",
      "Content-Type: text/plain; charset=utf-8",
      "",
      preview,
    ].join("\n");

    const encodedMessage = btoa(email)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          raw: encodedMessage,
        }),
      }
    );

    if (response.ok) {

      alert("Email Sent Successfully");

    } else {

      alert("Failed to send email");
    }
  };

  const InputField = ({ label, name, placeholder }) => (

    <div>

      <label className="block mb-2 font-medium">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border p-3 rounded-2xl"
      />

    </div>
  );

  return (

    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto space-y-6">

        <div className="bg-white p-8 rounded-3xl shadow-xl">

          <h1 className="text-4xl font-bold">
            QA Email Automation Dashboard
          </h1>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-5">

          <InputField
            label="Tester Email"
            name="testerEmail"
            placeholder="qa@test.com"
          />

          <InputField
            label="Offer Link"
            name="offerLink"
            placeholder="https://offer-link.com"
          />

          <InputField
            label="Test Link"
            name="testLink"
            placeholder="https://test-link.com"
          />

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-5">

          <h2 className="text-2xl font-bold">
            CRM Login Details
          </h2>

          <InputField
            label="CRM URL"
            name="crmUrl"
          />

          <InputField
            label="CRM Username"
            name="crmUsername"
          />

          <InputField
            label="CRM Password"
            name="crmPassword"
          />

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-5">

          <h2 className="text-2xl font-bold">
            Everflow Login Details
          </h2>

          <InputField
            label="Everflow URL"
            name="everflowUrl"
          />

          <InputField
            label="Everflow Username"
            name="everflowUsername"
          />

          <InputField
            label="Everflow Password"
            name="everflowPassword"
          />

          <InputField
            label="API ID"
            name="apiId"
          />

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-5">

          <h2 className="text-2xl font-bold">
            Card Details
          </h2>

          <InputField label="Visa" name="visa" />
          <InputField label="Master" name="master" />
          <InputField label="Prepaid" name="prepaid" />
          <InputField label="Visa Decline" name="visaDecline" />
          <InputField label="Bin Visa Decline" name="binVisaDecline" />
          <InputField label="Bin Master (Rebill)" name="binMasterRebill" />
          <InputField label="Bin Visa Initial" name="binVisaInitial" />
          <InputField
            label="Bin Master Initial Decline"
            name="binMasterInitialDecline"
          />

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-5">

          <InputField
            label="1st Check CID"
            name="check1Cid"
          />

          <InputField
            label="1st Check PID"
            name="check1Pid"
          />

          <InputField
            label="2nd Check CID"
            name="check2Cid"
          />

          <InputField
            label="2nd Check PID"
            name="check2Pid"
          />

          <InputField
            label="3rd Check CID"
            name="check3Cid"
          />

          <InputField
            label="3rd Check PID"
            name="check3Pid"
          />

          <InputField
            label="4th Check CID"
            name="check4Cid"
          />

          <InputField
            label="4th Check PID"
            name="check4Pid"
          />

          <InputField
            label="5th Check CID"
            name="check5Cid"
          />

          <InputField
            label="5th Check PID"
            name="check5Pid"
          />

        </div>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={generateEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl"
          >
            Generate Email
          </button>

          <button
            onClick={exportTXT}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl"
          >
            Export TXT
          </button>

          <button
            onClick={exportHTML}
            className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl"
          >
            Export HTML
          </button>

          <button
            onClick={copyEmail}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl"
          >
            Copy Email
          </button>

          <button
            onClick={() => login()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl"
          >
            Login Gmail
          </button>

          <button
            onClick={sendEmail}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl"
          >
            Send Email
          </button>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-2xl font-bold mb-4">
            Generated Email Preview
          </h2>

          <div className="bg-slate-100 p-6 rounded-2xl whitespace-pre-wrap min-h-[500px]">
            {preview || "Preview will appear here..."}
          </div>

        </div>

      </div>

    </div>
  );
}