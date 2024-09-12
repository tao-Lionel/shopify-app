import { authenticate } from "../shopify.server";
import { json, redirect } from "@remix-run/node";

import { Page, Layout, PageActions, Card } from "@shopify/polaris";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import db from "../db.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getPopup } from "models/popup.server";
import EmailPopup from "../components/EmailPopup";
import dayjs from "dayjs";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    return json({
      destination: "product",
      title: "",
    });
  }

  return json(await getPopup(Number(params.id), admin.graphql));
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const data = {
    ...Object.fromEntries(await request.formData()),
    shop: shop,
    isActive: false,
  };

  const popup =
    params.id === "new"
      ? await db.popup.create({ data })
      : await db.popup.update({ where: { id: Number(params.id) }, data });

  return redirect(`/app`);
}

export default function CreatePopup() {
  const popup = useLoaderData<typeof loader>();
  // const [formState, setFormState] = useState(popup);
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  // const [toastContent, setToastContent] = useState("");

  const submit = useSubmit();
  async function handleSave() {
    const data = {
      displayTime: dayjs().format(),
      createdAt: dayjs().format(),
      updatedAt: dayjs().format(),
    };

    submit(data, { method: "post" });
  }

  return (
    <Page>
      <ui-title-bar title={popup.id ? "编辑弹窗" : "新建弹窗"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          弹窗
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <EmailPopup></EmailPopup>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "创建弹窗",
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
