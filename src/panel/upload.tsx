import React, { useState } from "react";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { config } from "../config";

import type { UploadChangeParam } from "antd/lib/upload";
import type { PanelUploadProps } from "./type";
export const PanelUpload: React.FC<PanelUploadProps> = (props) => {
  const { onUpload } = props;

  const [fileListState, setFileListState] = useState<
    UploadChangeParam["fileList"]
  >([]);

  const cfg = {
    accept: ".js,.jsx,.ts,.tsx",
    name: "file",
    action: config.get("upload"),
    fileList: fileListState,
    onChange(info: UploadChangeParam) {
      const { file, fileList } = info;
      const { status, name } = file;
      if (status === "error") {
        message.error(`${name} file upload failed.`);
      } else if (status === "done") {
        // done
        message.success(`${name} file upload success.`);
        const { response } = file;
        if (onUpload) {
          onUpload(response.data);
        }
      } else if (status === "uploading") {
        // uploading
        // message.info(`${name} file uploading.`);
      }
      setFileListState([...fileList.slice(-1)]);
    },
  };

  return (
    <Upload {...cfg}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};
