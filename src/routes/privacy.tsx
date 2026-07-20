/* /privacy — Story Pros privacy policy (adapted from the reviewed draft) */

import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/empowered/LegalPage";
import { LEGAL } from "@/data/legalConfig";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection heading="The short version">
        <p>
          Story Pros is made by {LEGAL.businessName}, based in Canada, for children ages 4 to 10
          and the adults who care for them. Parents create and control accounts. Children never
          create accounts, and we never collect a child's email, phone number, photos, or
          location. About your child we store only a first name or nickname, an age, and their
          learning activity inside the app. We do not show ads, and we never sell or rent
          anyone's information. You can ask us to delete your account and all of your family's
          data at any time.
        </p>
      </LegalSection>

      <LegalSection heading="What we collect">
        <p>
          From parents and guardians: your email address, display name, and password (stored in
          hashed form, meaning we cannot read it), or your Google or Apple sign-in, plus your
          subscription status. Payments are handled by our payment processor; we never see or
          store full card numbers.
        </p>
        <p>
          About your child, entered by you: a first name or nickname and an age. We recommend a
          nickname if you prefer. We do not ask for a last name, birthdate, email, photo,
          school, or location.
        </p>
        <p>
          Created while your child plays: stories completed, answers to in-story questions,
          scores by skill area, time spent on activities, play streaks, in-app rewards, and any
          voice recordings your child chooses to save while retelling a story. This data exists
          to show you how your child's language skills are developing. That is the product.
        </p>
        <p>
          Automatically: basic technical data needed to run the service, such as browser type
          and error reports. We do not use advertising trackers.
        </p>
      </LegalSection>

      <LegalSection heading="How we use information">
        <p>
          We use information only to run the app and save your child's progress across devices,
          show progress to you, process subscriptions, respond to support requests, keep the
          service secure, and improve the learning content using aggregated patterns that are
          never used to profile individual children. We do not use your or your child's
          information for third-party advertising, and we do not sell or rent personal
          information to anyone.
        </p>
      </LegalSection>

      <LegalSection heading="Children's privacy">
        <p>
          Story Pros is designed for children but controlled by adults. Children cannot create
          accounts, enter contact information, chat with anyone, or make purchases. We collect
          the minimum about a child needed for the product to work, all entered or generated
          under a parent's account. For families in the United States, we operate consistent
          with COPPA: the parent's creation of the child profile is the parental consent for
          the limited child data described above. For Canadian families, we handle personal
          information in accordance with PIPEDA. Parents may review, correct, or delete their
          child's information at any time.
        </p>
      </LegalSection>

      <LegalSection heading="Who else sees data">
        <p>
          We use a small number of service providers to run Story Pros, each receiving only
          what is needed to do their job: our hosting and database provider (Lovable, built on
          Supabase infrastructure), our payment processor once subscriptions launch, and Google
          or Apple only if you choose to sign in with them. We may disclose information if
          required by law. If {LEGAL.businessName} is ever acquired or merged, your information
          remains protected under this policy and you will be notified.
        </p>
      </LegalSection>

      <LegalSection heading="Storage and security">
        <p>
          Data is stored with row-level security: each family's data is technically isolated so
          one account cannot read another's. Passwords are hashed. Some progress data is also
          cached on your own device so the app works smoothly; it stays on your device. No
          internet service can promise perfect security, but if we become aware of a breach
          affecting your data, we will notify you as required by law.
        </p>
      </LegalSection>

      <LegalSection heading="Retention and your choices">
        <p>
          We keep your family's data while your account is active. If you ask us to delete your
          account, we delete personal data within 30 days, except minimal records we are
          legally required to keep. At any time you can review and update your child's profile
          in Settings or ask us to delete your account and all associated data by contacting{" "}
          {LEGAL.contactEmail}. Canadian users may also contact the Office of the Privacy
          Commissioner of Canada with concerns; we would appreciate the chance to resolve
          issues first.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          If we make material changes to this policy, we will notify you by email or in-app
          notice before they take effect.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
