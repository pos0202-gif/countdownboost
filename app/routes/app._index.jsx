import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";
import db from "../db.server";

const defaultSettings = {
  enabled: false,
  headline: "Limited Time Offer",
  message: "Get 10% off before the timer ends.",
  endTime: "",
  backgroundColor: "#111111",
  textColor: "#ffffff",
  buttonText: "Shop now",
  buttonLink: "/collections/all",
  countdownType: "fixed",
  evergreenMinutes: 30,
  bannerPosition: "inline",
};

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);

  const appUrl = process.env.SHOPIFY_APP_URL || new URL(request.url).origin;

  await billing.require({
    plans: [MONTHLY_PLAN],
    onFailure: async () =>
      billing.request({
        plan: MONTHLY_PLAN,
        isTest: true,
        returnUrl: `${appUrl}/app`,
      }),
  });

  const settings = await db.countdownSettings.findUnique({
    where: { shop: session.shop },
  });

  return settings || defaultSettings;
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();

  const data = {
    shop: session.shop,
    enabled: formData.get("enabled") === "on",
    headline: formData.get("headline") || defaultSettings.headline,
    message: formData.get("message") || defaultSettings.message,
    endTime: formData.get("endTime") || "",
    backgroundColor:
      formData.get("backgroundColor") || defaultSettings.backgroundColor,
    textColor: formData.get("textColor") || defaultSettings.textColor,
    buttonText: formData.get("buttonText") || defaultSettings.buttonText,
    buttonLink: formData.get("buttonLink") || defaultSettings.buttonLink,
    countdownType: formData.get("countdownType") || defaultSettings.countdownType,
    evergreenMinutes: Number(formData.get("evergreenMinutes") || 30),
    bannerPosition:
      formData.get("bannerPosition") || defaultSettings.bannerPosition,
  };

  const settings = await db.countdownSettings.upsert({
    where: { shop: session.shop },
    update: data,
    create: data,
  });

  const shopResponse = await admin.graphql(`
    #graphql
    query GetShopId {
      shop {
        id
      }
    }
  `);

  const shopJson = await shopResponse.json();
  const shopId = shopJson.data.shop.id;

  const metafieldValue = JSON.stringify({
    enabled: settings.enabled,
    headline: settings.headline,
    message: settings.message,
    endTime: settings.endTime,
    backgroundColor: settings.backgroundColor,
    textColor: settings.textColor,
    buttonText: settings.buttonText,
    buttonLink: settings.buttonLink,
    countdownType: settings.countdownType,
    evergreenMinutes: settings.evergreenMinutes,
    bannerPosition: settings.bannerPosition,
  });

  const metafieldResponse = await admin.graphql(
    `
      #graphql
      mutation SaveCountdownSettings($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace: "countdownboost",
            key: "settings",
            type: "json",
            value: metafieldValue,
          },
        ],
      },
    },
  );

  const metafieldJson = await metafieldResponse.json();
  const metafieldErrors = metafieldJson.data?.metafieldsSet?.userErrors || [];

  if (metafieldErrors.length > 0) {
    return {
      success: false,
      settings,
      errors: metafieldErrors,
    };
  }

  return {
    success: true,
    settings,
  };
};

export default function Index() {
  const loadedSettings = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const settings = fetcher.data?.settings || loadedSettings;

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Settings saved");
    }

    if (fetcher.data?.success === false) {
      shopify.toast.show("Settings saved to database, but metafield failed");
    }
  }, [fetcher.data, shopify]);

  const isSaving = fetcher.state === "submitting";

  return (
    <s-page heading="CountdownBoost Settings">
      <s-section heading="Countdown Banner Settings">
        <s-paragraph>
          Configure your countdown banner settings below.
        </s-paragraph>

        <fetcher.Form method="post">
          <s-stack direction="block" gap="base">
            <s-box>
              <s-checkbox
                label="Enable banner"
                name="enabled"
                defaultChecked={settings.enabled}
              />
            </s-box>

            <s-text-field
              label="Banner headline"
              name="headline"
              defaultValue={settings.headline}
            />

            <s-text-field
              label="Promo message"
              name="message"
              defaultValue={settings.message}
            />

            <s-select
              label="Countdown type"
              name="countdownType"
              defaultValue={settings.countdownType || "fixed"}
            >
              <s-option value="fixed">Fixed end time</s-option>
              <s-option value="evergreen">Evergreen countdown</s-option>
            </s-select>

            <s-text-field
              label="Countdown end time"
              name="endTime"
              type="datetime-local"
              defaultValue={settings.endTime}
            />

            <s-text-field
              label="Evergreen minutes"
              name="evergreenMinutes"
              type="number"
              defaultValue={settings.evergreenMinutes || 30}
            />

            <s-select
              label="Banner position"
              name="bannerPosition"
              defaultValue={settings.bannerPosition || "inline"}
            >
              <s-option value="inline">Inline banner</s-option>
              <s-option value="sticky">Sticky top banner</s-option>
            </s-select>

            <s-text-field
              label="Background color"
              name="backgroundColor"
              defaultValue={settings.backgroundColor}
            />

            <s-text-field
              label="Text color"
              name="textColor"
              defaultValue={settings.textColor}
            />

            <s-text-field
              label="Button text"
              name="buttonText"
              defaultValue={settings.buttonText}
            />

            <s-text-field
              label="Button link"
              name="buttonLink"
              defaultValue={settings.buttonLink}
            />

            <s-button variant="primary" type="submit" loading={isSaving}>
              Save Settings
            </s-button>
          </s-stack>
        </fetcher.Form>
      </s-section>

      <s-section slot="aside" heading="Countdown Features">
        <s-unordered-list>
          <s-list-item>Fixed-date countdown timers</s-list-item>
          <s-list-item>Evergreen countdown campaigns</s-list-item>
          <s-list-item>Custom banner colors</s-list-item>
          <s-list-item>Custom headlines and messages</s-list-item>
          <s-list-item>Call-to-action buttons</s-list-item>
          <s-list-item>Sticky banner support</s-list-item>
          <s-list-item>Easy setup and management</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};