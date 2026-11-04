'use client';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Terms & Condition
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          {/* OVERVIEW */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">OVERVIEW</h2>
            <p className="mb-3">
              This privacy policy sets out how ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE uses and protects any information that you give when you use this app.
            </p>
            <p className="mb-3">
              ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this app, then you can be assured that it will only be used in accordance with this privacy statement.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4 text-amber-800 italic rounded-r">
              &quot;We do not store credit card/finacial details nor do we share customer details with any 3rd parties&quot;
            </div>
            <p>
             ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from 1 January 2022.
            </p>
          </div>

          {/* What we collect */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What we collect</h2>
            <p className="mb-2">We may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name and job title</li>
              <li>Contact information including email address</li>
              <li>Demographic information such as postcode</li>
            </ul>
          </div>

          {/* What we do with the information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What we do with the information we gather</h2>
            <p className="mb-2">We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Internal record keeping.</li>
              <li>We may use the information to improve our products and services.</li>
              <li>We may periodically send promotional emails about new things, other information which we think you may find interesting using the email address which you have provided.</li>
              <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the app according to your interests.</li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Security</h2>
            <p>
              We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
            </p>
          </div>

          {/* Links to other websites */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Links to other websites</h2>
            <p>
              This app is not linked to any social website. we will not share your data with any social website.
            </p>
          </div>

          {/* Controlling your personal information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Controlling your personal information</h2>
            <p className="mb-2">You may choose to restrict the collection or use of your personal information in the following ways:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Whenever you are asked to fill in a form on the app, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
              <li>If you have previously agreed to us using your personal information , you may change your mind at any time by writing to or emailing us.</li>
              <li>We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</li>
            </ul>
          </div>

          {/* Contact and Data Protection Details */}
          <div className="pt-4 border-t border-gray-200 text-sm space-y-3">
            <p>
              You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. If you would like a copy of the information held on you please email us at <a href="mailto:bengalassociation2026@gmail.com" className="text-blue-600 hover:underline font-medium">bengalassociation2026@gmail.com</a>.
            </p>
            <p>
              If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Terms;