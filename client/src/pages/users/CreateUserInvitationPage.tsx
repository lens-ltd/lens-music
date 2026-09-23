import Button from '@/components/inputs/Button';
import { BackButton, PageFooter } from '@/components/layout/PageFooter';
import Input from '@/components/inputs/Input';
import TextArea from '@/components/inputs/TextArea';
import { Heading } from '@/components/text/Headings';
import UserLayout from '@/containers/UserLayout';
import { useCreateUserInvitations } from '@/hooks/users/userInvitations.hooks';

import { LuSend } from 'react-icons/lu';

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
        <header className="w-full flex flex-col gap-1">
          <Heading>Invite a user</Heading>
          <p className="text-[13px] text-(--muted) font-normal">
            Send access invitations to teammates one by one or in bulk.
          </p>
        </header>

        <section className="grid w-full gap-5 xl:grid-cols-2">
          <div className="flex w-full flex-col gap-4 card-framed p-5 sm:p-6">
            <h2 className="text-[14px] font-medium text-(--ink)">
              Send invitation
            </h2>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-(--muted)">
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
              icon={LuSend}
            >
              Send invite
            </Button>
          </div>

          <div className="flex w-full flex-col gap-4 card-framed p-5 sm:p-6">
            <h2 className="text-[14px] font-medium text-(--ink)">
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
              icon={LuSend}
            >
              Send bulk invites
            </Button>
          </div>
        </section>

        <PageFooter
          back={<BackButton route="/users/invitations">Back to invitations</BackButton>}
        />
      </main>
    </UserLayout>
  );
};

export default CreateUserInvitationPage;
