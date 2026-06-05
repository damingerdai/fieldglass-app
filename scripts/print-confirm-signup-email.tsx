import ConfirmSignupEmail from '../email/confirm-signup-email';
import { render } from '@react-email/components';

const html = await render(<ConfirmSignupEmail />, {
  pretty: true,
});
console.log(html);