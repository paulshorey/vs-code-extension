// Examples how to troubleshoot SyncFusion Document Editor:
// - `copySerializedSfdt` (Cmd+C clipboard does not copy full SFDT)
// - `onLoadDefault` (to load SFDT hardcoded in a string, instead of the database)
// Test this code in:
// https://stackblitz.com/edit/react-zarqbts4-v4hj9ws7?file=index.js,package.json

import { createRoot } from "react-dom/client";
import "./index.css";
import * as React from "react";
import { useEffect, useRef } from "react";

import {
  DocumentEditorContainerComponent,
  Ribbon,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
DocumentEditorContainerComponent.Inject(Toolbar, Ribbon);
import { registerLicense } from "@syncfusion/ej2-base";

// Registering Syncfusion license key
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1JGaF5cXGpCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdlWX5fcnVQRWRYU0VwV0ZWYE8=",
);

// tslint:disable:max-line-length
const Default = () => {
  let hostUrl =
    "https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/";
  let container = useRef(null);
  let titleBar;
  const onLoadDefault = () => {
    // tslint:disable
    let defaultDocument = {
      sfdt: "UEsDBAoAAAAIAG2kw1yzL7WEKgUAAN8zAAAEAAAAc2ZkdO1bW2/bNhT+Kxr3sgGOobssYS9bmmDAgrbYCuwhzQMl64bKkkbScRvD/30kD5VIsZ0ojeJ4mQSkhzeRH7/vHFIm0TWqapYv8pv4r2TOUMDIMp4gnIUoSHBBeZrGEQou18LWBAVrVK9Q4PjO1PR9f+Z5vum7s9kE1RkKZrYx9XVdN23bsHXXdCaoWKDAMyeIKMuUDYU1Jiibo8ByJyhRdp7UKNC5rWJIhDkYjgK9j1cfcRqjCYrLBAW8m0RYXk3yxsbS5kmJAt59HoOt05LyDn4lOMwj/n4ZVQWVNfE/K2mLkEXyVai5vNrwQeXMifwXWICSOhFEhHNChWUc6Jq3LhhYkoINVT4Dcy2MaJaXcpxEWYWjoExmKSvFTCuywAUSrRP1XgSDNholiZxPLlsliaCplcWdXJnEnXwryzvOYX4PdC86V+7wrJFYwalCpFqd0BqXgWZqmvbLycmJlqdlReL5D2jDaR/5fR6/3IFv+d1i94q3UoHcl9/5XNnlTr6pqhbrgmnZIsFkbEZNgYioWhaRlUpc82npgvRc2rcbWC/NuGF4XcZlgWLcaBg3uoybI+MHZtySoAiAymQ1DskXmciArWxOYKcbBnIayt7ScNVYQJxiyONVY6EctNwIz3jbW90YkSPjY0SO/vGIf4xfJYdm3BgZH3ed/9muY86mtu+6rt88zrgNjQ4zbkPjNvS2zqG04zyJ2toP/yu/CTjOlPCuL4VHt/4E/rDYwap0P+GFosOp0yDeLpYT2C4Od7feNb3tVtc7Slt6RRSO+puIYTB5cVWgw82BM7XhKkEmQqioV8qw9kUBXiZMKVoVfMOyn3+gPEDgZnC3MMCKeQyzCbF0xqEmte5D3bBr0yccFjHV3p1dnH06007PLi40yvKi0H7788MfZ++1ZZlUhC1LzOLi23SQa4mn8N7eHzOouWpJonhoMUJvxOammDvFRR6SnHe7VGMBgxBWjWr0RrAIL0k+717DUYtr3Klq6G1KxHI7xC5J7u2Wag0IYdHAdNcWWhX3PeOLGLVJr8rb9CpqXOuO6IQqRCwp1CLGVnAJqW4CY3W5mHGwiM+dKhsJOJBgTSKCRLIAaDWYecYWhQoSwB5Vi1qJ8o2v1DABueSKHn48l49gldfL0Oi4ier8eYTf97Ty690Qws3FiL/HeJ6XqWYMNeijKhtmV+ap7vkG/2Xk6J5n6r7tdXU3ttcqCAK3GwTaRZ7yrZsXSn7Nc4f/3kL3/PquUde7VTncBLeCtU2Qdpphgh5hsWnEwAcOAvddnOBlwbSPmOCU4DrTzquS3WLbU93BuLk/EfNg7vA0bzD3eYN1WG8w+3iDud8brNfyhgabdaQCW/sENh9kzDi3PNcaUGCrj8DWfoFfDm5Pge0jFdjeFjjvfA4eKILtPgLbuwR+abg9BXaOVGBnRwQfUFenj67OzsB9VTndI5XTfZKcg6/Dbh853SfKeYDl1ztSOb3vW34H19Xro6v3vcvvAQSeHanAs30fUPrUeZAzSz4DSjzrI/Fs/yfUSwLuKbJ/pCL7D0Xx66jt91Hbfzigj0H2mAyj+e6TrO1DmQ6hkjuFogF1XlXs9UEpFA0oqNR++jsOfx4GmggCBxByQ8UZJngFxXj7TG8/0A6yrrA7lxrpU7p6evoJkDFYdxc5bdUNuOSII86I7mdPEnZvdHH+XMgzaS5GATZagCUq+xVsvkgpdCT+E8Ya0effpfY6LV/f5uCM//PnJSfbUneN0evCsBsY5YFg8NE2m38BUEsBAhQACgAAAAgAbaTDXLMvtYQqBQAA3zMAAAQAAAAAAAAAAAAAAAAAAAAAAHNmZHRQSwUGAAAAAAEAAQAyAAAATAUAAAAA",
    };
    // tslint:enable
    container.current.documentEditor.open(JSON.stringify(defaultDocument));
    container.current.documentEditor.documentName = "Getting Started";
  };

  useEffect(() => {
    onLoadDefault();
  }, []);

  const copySerializedSfdt = async () => {
    const sfdt = container.current.documentEditor.serialize();
    try {
      await navigator.clipboard.writeText(sfdt);
      console.log("Serialized SFDT copied to clipboard.");
    } catch (err) {
      console.error("Clipboard write failed; logging SFDT instead:", err);
      console.log(sfdt);
    }
  };

  return (
    <div className="control-pane">
      <div className="control-section">
        <div id="documenteditor_titlebar" className="e-de-ctn-title"></div>
        <div id="documenteditor_container_body">
          <DocumentEditorContainerComponent
            id="container"
            ref={container}
            style={{ display: "block" }}
            height={"100dvh"}
            toolbarMode={"Ribbon"}
            serviceUrl={hostUrl}
            enableToolbar={true}
            locale="en-US"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={copySerializedSfdt}
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          zIndex: 9999,
          margin: "12px",
          padding: "10px 16px",
          fontSize: "13px",
          fontWeight: 600,
          color: "#fff",
          background: "#2f5496",
          border: "none",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          cursor: "pointer",
        }}
      >
        Copy serialize() SFDT
      </button>
    </div>
  );
};
export default Default;

const root = createRoot(document.getElementById("app"));
root.render(<Default />);

/*
<!DOCTYPE html>
<html>
<head>
    <title>Syncfusion React Sample</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="description" content="Syncfusion React UI Components" />
    <meta name="author" content="Syncfusion" />
    <link href="https://cdn.syncfusion.com/ej2/31.2.12/tailwind3.css" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" />
</head>

<body class="tailwind3">
    <div id='app'>
</body>
</html>
*/

/*
{
  "name": "tshsgawq--run",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@syncfusion/ej2-base": "^32.2.7",
    "@syncfusion/ej2-buttons": "^32.2.7",
    "@syncfusion/ej2-documenteditor": "^32.2.7",
    "@syncfusion/ej2-navigations": "^32.2.7",
    "@syncfusion/ej2-react-base": "^32.2",
    "@syncfusion/ej2-react-buttons": "^32.2.7",
    "@syncfusion/ej2-react-documenteditor": "^32.2.7",
    "@syncfusion/ej2-react-popups": "^32.2.7",
    "@syncfusion/ej2-splitbuttons": "^32.2.7",
    "react": "latest",
    "react-dom": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "react-scripts": "latest"
  }
}
*/
