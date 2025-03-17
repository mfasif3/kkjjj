export default function EmbedInstructions() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">How to Embed the Pushup Game in Your Wix Website</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Step 1: Deploy This App</h2>
          <p>First, you need to deploy this Next.js application to a hosting service like Vercel or Netlify.</p>
          <ol className="list-decimal ml-6 mt-2 space-y-2">
            <li>Push this code to a GitHub repository</li>
            <li>Connect your repository to Vercel or Netlify</li>
            <li>Deploy the application</li>
            <li>Note down your deployed URL (e.g., https://your-pushup-game.vercel.app)</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Step 2: Add to Your Wix Site</h2>
          <p>Now, you can embed the game in your Wix website:</p>
          <ol className="list-decimal ml-6 mt-2 space-y-2">
            <li>Log in to your Wix account and open your site in the editor</li>
            <li>Click the "+" button to add a new element</li>
            <li>Go to "Embed" and select "HTML iframe"</li>
            <li>In the settings panel, click "Enter Code"</li>
            <li>Paste the following code, replacing YOUR_DEPLOYED_URL with your actual deployed URL:</li>
          </ol>

          <div className="bg-gray-100 p-4 rounded-md mt-3 overflow-x-auto">
            <pre className="text-sm">
              {`<iframe 
  src="https://YOUR_DEPLOYED_URL/embed" 
  width="100%" 
  height="600px" 
  frameborder="0"
  allow="autoplay"
  scrolling="no"
></iframe>`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Step 3: Add Sound Files</h2>
          <p>To add your custom sound files:</p>
          <ol className="list-decimal ml-6 mt-2 space-y-2">
            <li>Create a folder named "sounds" in the "public" directory of your project</li>
            <li>Add the following sound files to that folder:</li>
            <ul className="list-disc ml-6 mt-1">
              <li>
                <code>background-music.mp3</code> - Looping background music
              </li>
              <li>
                <code>click.mp3</code> - Sound when doing a pushup
              </li>
              <li>
                <code>combo.mp3</code> - Sound when achieving a combo
              </li>
              <li>
                <code>level-up.mp3</code> - Sound when reaching 100 pushups
              </li>
              <li>
                <code>game-over.mp3</code> - Sound when the game ends
              </li>
              <li>
                <code>countdown.mp3</code> - Sound for the final 5 seconds
              </li>
              <li>
                <code>start.mp3</code> - Sound when starting the game
              </li>
            </ul>
            <li>Redeploy your application</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Step 4: Customize (Optional)</h2>
          <p>You can customize the game by:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Changing colors in the CSS</li>
            <li>Adjusting game parameters like timer duration</li>
            <li>Adding your own branding</li>
            <li>Modifying the game mechanics</li>
          </ul>
        </section>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-6">
          <h3 className="text-lg font-semibold text-blue-800">Troubleshooting</h3>
          <ul className="list-disc ml-6 mt-2 text-blue-800">
            <li>If sounds don't play, check that your browser allows autoplay</li>
            <li>If the iframe is too small, adjust the height and width values</li>
            <li>For mobile compatibility, ensure your Wix site is responsive</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

