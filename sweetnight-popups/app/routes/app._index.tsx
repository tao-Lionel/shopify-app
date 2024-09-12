import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  EmptyState,
  IndexTable,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getPopups } from "models/popup.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { composeEventHandlers } from "@remix-run/react/dist/components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const popups = await getPopups(session.shop, admin.graphql);

  console.log("1111111111111111", popups);

  return json({
    popups,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {};

const EmptyPopupState = ({ onAction }: any) => (
  <EmptyState
    heading="新建弹窗"
    action={{
      content: "新建弹窗",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>新建一个弹窗用来收集用户邮箱</p>
  </EmptyState>
);

const PopupTable = ({ popups }: any) => {
  console.log("popups", popups);

  const PopupItem = popups.map((item) => {
    return <List.Item key={item.id}>{item.id}</List.Item>;
  });

  return <List type="弹窗">{PopupItem}</List>;

  // <IndexTable
  //   headings={[
  //     { title: "Thumbnail", hidden: true },
  //     { title: "Title" },
  //     { title: "Product" },
  //     { title: "Date created" },
  //     { title: "Scans" },
  //   ]}
  //   selectable={false}
  // >
  //   {/* {qrCodes.map((qrCode) => (
  //     <PopupTableRow key={qrCode.id} qrCode={qrCode} />
  //   ))} */}
  // </IndexTable>
};

export default function Index() {
  const { popups } = useLoaderData<typeof loader>();
  console.log("22222", popups);
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="Sweetnight Popup">
        <button variant="primary" onClick={() => navigate("/app/popup/new")}>
          新建弹窗
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {popups.length === 0 ? (
              <EmptyPopupState onAction={() => navigate("popup/new")} />
            ) : (
              <PopupTable popups={popups} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
