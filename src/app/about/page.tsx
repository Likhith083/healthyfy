export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background w-full px-16 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">About HealthMatch Direct</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          HealthMatch Direct is dedicated to making healthcare accessible, efficient, and personalized for everyone. Our platform connects patients with the right specialists, streamlines appointment management, and empowers users with secure health data and analytics.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-12 w-full mb-16">
        <div className="bg-card rounded-lg shadow-md p-8 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-base text-muted-foreground">
            To intelligently match patients with the most suitable healthcare professionals, ensuring timely, effective, and compassionate care for all.
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-md p-8 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
          <ul className="list-disc pl-6 text-base text-muted-foreground space-y-2">
            <li>Patient-Centered Care</li>
            <li>Data Security & Privacy</li>
            <li>Transparency & Trust</li>
            <li>Innovation in Healthcare</li>
            <li>Community & Support</li>
          </ul>
        </div>
      </div>
      <div className="bg-card rounded-lg shadow-md p-8 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Meet the Team</h2>
        <p className="text-base text-muted-foreground mb-4">
          Our team is made up of passionate healthcare professionals, technologists, and patient advocates. We are committed to building a platform that truly makes a difference in people's lives.
        </p>
        <ul className="list-disc pl-6 text-base text-muted-foreground space-y-1">
          <li>Dr. Jane Smith – Chief Medical Officer</li>
          <li>Alex Johnson – Lead Engineer</li>
          <li>Priya Patel – Product Manager</li>
          <li>Michael Lee – UX Designer</li>
        </ul>
      </div>
    </div>
  );
} 