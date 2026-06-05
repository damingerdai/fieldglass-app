import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr
} from '@react-email/components';

export const ConfirmSignupEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Verify your Fieldglass App account</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#e5e7eb] rounded-lg my-[40px] mx-auto p-[32px] max-w-[465px] shadow-sm">
            <Section>
              <Text className="text-black text-[20px] font-bold tracking-tight m-0">
                Fieldglass App
              </Text>
            </Section>

            <Heading className="text-black text-[24px] font-semibold text-left p-0 my-[30px] mx-0">
              Verify your email address
            </Heading>

            <Text className="text-[#374151] text-[14px] font-medium m-0 mb-[16px]">
              Hi {'{{ .Email }}'},
            </Text>

            <Text className="text-[#374151] text-[14px] leading-[24px] m-0">
              Thanks for signing up for <strong>Fieldglass App</strong>! Please click the button below 
              to verify your email address and activate your account.
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="bg-[#000000] rounded-md text-white text-[14px] font-medium no-underline text-center px-6 py-3"
                href="{{ .ConfirmationURL }}"
              >
                Confirm Email
              </Button>
            </Section>

            <Text className="text-[#6b7280] text-[13px] leading-[22px]">
              If you didn't create an account, you can safely ignore this email. 
              This verification link is only valid for the next 24 hours.
            </Text>

            <Hr className="border border-solid border-[#e5e7eb] my-[26px] mx-0 w-full" />

            <Text className="text-[#9ca3af] text-[12px] leading-[18px]">
              &copy; 2026 Fieldglass App. All rights reserved. <br />
              This is an automated security notification.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};