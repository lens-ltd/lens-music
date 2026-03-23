import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import TextArea from '@/components/inputs/TextArea';
import { Heading } from '@/components/text/Headings';
import UserLayout from '@/containers/UserLayout';
import { useCreateUserInvitations } from '@/hooks/users/userInvitations.hooks';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CreateUserInvitationPage = () => {
  const {
    singleEmail,
    setSingleEmail,
    bulkRaw,
    setBulkRaw,
    submitSingleInvite,
    submitBulkInvite,
    isSubmittingSingle,
    isSubmittingBulk,
  } = useCreateUserInvitations();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Create User Invitation</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              Send access invitations to teammates one by one or in bulk.
            </p>
          </div>
          <Button route="/users/invitations">Back to invitations</Button>
        </nav>

        <section className="w-full grid gap-6 xl:grid-cols-2">
          <div className="w-full flex flex-col gap-4 rounded-xl border border-[color:var(--lens-sand)] bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-medium text-[color:var(--lens-ink)]">
              Send invitation
            </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/50">
                Email
              </label>
              <Input
                placeholder="name@company.com"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
              />
            </div>
            <Button
              submit
              type="button"
              primary
              onClick={() => void submitSingleInvite()}
              disabled={isSubmittingSingle}
              isLoading={isSubmittingSingle}
              icon={faPaperPlane}
            >
              Send invite
            </Button>
          </div>

          <div className="w-full flex flex-col gap-4 rounded-xl border border-[color:var(--lens-sand)] bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-medium text-[color:var(--lens-ink)]">
              Bulk invite (max 50)
            </h2>
            <TextArea
              rows={10}
              placeholder="One email per line, or comma-separated"
              value={bulkRaw}
              onChange={(e) => setBulkRaw(e.target.value)}
            />
            <Button
              submit
              type="button"
              onClick={() => void submitBulkInvite()}
              disabled={isSubmittingBulk}
              isLoading={isSubmittingBulk}
              icon={faPaperPlane}
            >
              Send bulk invites
            </Button>
          </div>
        </section>
      </main>
    </UserLayout>
  );
};

export default CreateUserInvitationPage;
