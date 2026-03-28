import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { ErnContext } from '../interfaces/ern-context.interface';
import { formatDdexDateTime } from '../helpers/ern-xml.helper';

/**
 * Builds the <MessageHeader> section of the ERN NewReleaseMessage.
 */
export function buildMessageHeader(parent: XMLBuilder, ctx: ErnContext): void {
  const header = parent.ele('MessageHeader');

  header.ele('MessageThreadId').txt(ctx.release.id);
  header.ele('MessageId').txt(ctx.messageId);

  const sender = header.ele('MessageSender');
  sender.ele('PartyId').txt(ctx.senderDpid);
  sender.ele('PartyName').ele('FullName').txt(ctx.senderName);

  const recipient = header.ele('MessageRecipient');
  recipient.ele('PartyId').txt(ctx.recipientDpid);
  recipient.ele('PartyName').ele('FullName').txt(ctx.recipientName);

  header.ele('MessageCreatedDateTime').txt(formatDdexDateTime(new Date()));
  header.ele('MessageControlType').txt('LiveMessage');
}
