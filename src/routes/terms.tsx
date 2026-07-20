/* /terms — Story Pros terms of service (adapted from the reviewed draft) */

import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/empowered/LegalPage";
import { LEGAL } from "@/data/legalConfig";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalSection heading="What Story Pros is (and isn't)">
        <p>
          Story Pros is an educational app by {LEGAL.businessName} that helps children ages 4
          to 10 with Developmental Language Disorder and related needs build language skills
          through interactive stories. It was designed by an educator and a speech-language
          pathologist.
        </p>
        <p>
          Story Pros is an educational tool, not medical care. It does not diagnose, treat, or
          cure any condition, and it is not a substitute for assessment or therapy from a
          qualified speech-language pathologist or other professional. Skill scores and
          progress labels in the app are informal learning indicators, not clinical
          assessments. Always consult a qualified professional about your child's development.
        </p>
      </LegalSection>

      <LegalSection heading="Accounts">
        <p>
          You must be at least 18 (or the age of majority where you live) to create an
          account. Accounts are for parents and guardians. Children do not have accounts; they
          play through child profiles you create and control. You are responsible for keeping
          your login secure and for activity under your account. Provide accurate information,
          and tell us if you believe your account has been compromised.
        </p>
      </LegalSection>

      <LegalSection heading="Subscriptions and billing">
        <p>
          Story Pros offers a free tier with limited stories and a premium subscription
          ({LEGAL.premiumPrice}) unlocking the full story library and features. Subscriptions
          renew monthly until cancelled. You can cancel anytime and keep premium access until
          the end of the paid period. Except where required by law, payments are
          non-refundable, but contact us at {LEGAL.contactEmail}; we are reasonable people.
          Prices may change with at least 30 days' notice. During the beta period, features and
          pricing may change as we improve the product.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Please don't: share your account, attempt to access other families' data, reverse
          engineer or copy the app or its content, upload anything unlawful, or use the app to
          harass anyone. We may suspend or close accounts that violate these terms, with
          notice where practical.
        </p>
      </LegalSection>

      <LegalSection heading="Content and ownership">
        <p>
          The stories, characters (including Dan and Daria), illustrations, narration,
          activities, software, and scoring methodology are owned by {LEGAL.businessName} or
          its licensors and protected by copyright and other laws. We grant you a personal,
          non-transferable licence to use Story Pros for your family's non-commercial use.
          Your child's progress data belongs to your family; see the Privacy Policy for how we
          handle it.
        </p>
      </LegalSection>

      <LegalSection heading="Availability and changes">
        <p>
          We work hard to keep Story Pros available and improving, but we do not guarantee
          uninterrupted service, and we may add, change, or remove features. If we ever
          discontinue the service, we will give reasonable notice so you can export your
          child's progress.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimers and limitation of liability">
        <p>
          Story Pros is provided "as is." To the maximum extent permitted by law, we disclaim
          implied warranties and are not liable for indirect, incidental, or consequential
          damages. Our total liability for any claim is limited to the amount you paid us in
          the 12 months before the claim arose. Nothing in these terms limits liability that
          cannot be limited under applicable law, including Canadian consumer protection
          legislation; some provinces give you rights these terms cannot change.
        </p>
      </LegalSection>

      <LegalSection heading="Termination and governing law">
        <p>
          You can stop using Story Pros and ask us to delete your account at any time. We may
          suspend or terminate accounts for material breach of these terms, with notice where
          practical. These terms are governed by the laws of {LEGAL.province}, Canada, except
          where consumer protection law gives you the right to proceed in your home
          jurisdiction.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to these terms">
        <p>
          If we make material changes, we will notify you by email or in-app notice at least
          30 days before they take effect. Continuing to use Story Pros after that means you
          accept the updated terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
