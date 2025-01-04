
import {
  Page,
  Button,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  
  const handleConnect = () => {
    window.top.location.href = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=624455150004028&redirect_uri=https://alaska-qualification-director-medicaid.trycloudflare.com/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`;
  }

  return (
    <Page>
      <Button onClick={handleConnect}>Connect to Instagram</Button>
    </Page>
  );
}
