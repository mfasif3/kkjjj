export default function WixIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Wix Integration Guide</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Integration Steps</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <p className="mb-2">
              <strong>Set up Wix Member Registration:</strong>
            </p>
            <p>Configure your Wix site to collect member information during registration.</p>
          </li>
          <li>
            <p className="mb-2">
              <strong>Create a Wix HTTP Function:</strong>
            </p>
            <p>Use Velo by Wix to create an HTTP function that sends member data to your GenID API.</p>
          </li>
          <li>
            <p className="mb-2">
              <strong>Connect to GenID API:</strong>
            </p>
            <p>Send member data to your GenID API endpoint when a new member registers.</p>
          </li>
          <li>
            <p className="mb-2">
              <strong>Display Card Access:</strong>
            </p>
            <p>Provide members with a link to access their personalized GenID card.</p>
          </li>
        </ol>
      </div>

      <h2 className="text-2xl font-bold mb-4">Wix Code Example</h2>
      <div className="bg-gray-900 rounded-lg p-4 mb-8">
        <pre className="text-sm text-gray-300 overflow-x-auto">
          {`// In your Wix Velo code (backend)
import { fetch } from 'wix-fetch';

// This function would be triggered when a new member registers
export function registerMember(memberData) {
  const genIdApiUrl = "https://your-genid-site.com/api/register-member";

  return fetch(genIdApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY' // Add security as needed
    },
    body: JSON.stringify({
      name: memberData.name,
      email: memberData.email
    })
  })
  .then(response => response.json())
  .then(data => {
    // Store the GenID card URL in the member's data
    // You can use Wix Data to update the member record
    return data;
  })
  .catch(error => {
    console.error("Error registering with GenID:", error);
    throw error;
  });
}`}
        </pre>
      </div>

      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
        <p className="mb-4">
          For custom integration assistance or to discuss specific requirements for your Wix site, please contact our
          support team.
        </p>
        <p>
          <strong>API Endpoints:</strong>
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>
            <code className="bg-black/30 px-2 py-1 rounded">https://your-site.com/api/register-member</code> - Register
            new members
          </li>
          <li>
            <code className="bg-black/30 px-2 py-1 rounded">https://your-site.com/api/health-data</code> - Store and
            retrieve health data
          </li>
        </ul>
      </div>
    </div>
  )
}
