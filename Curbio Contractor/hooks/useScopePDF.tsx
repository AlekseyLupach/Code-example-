import { useEffect, useState } from "react"
import { ProjectJob, ProjectTask } from "../services/ProjectJobsService/types"
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { groupTasksByProposalSection } from "../utils/groupTasksByProposalSection";
import { colors } from "../config/theme";
import BlobUtil from "react-native-blob-util";

export enum Permits {
	None = 0,
	Trade = 1,
	Building = 2,
	BuildingCoastalFlorida = 3,
	Structural = 4,
	Commercial = 5
}

export type useScopePdfConfig = {
  job: ProjectJob,
  fileName: string,
  base64: boolean,
  directory?: string
}

export type PdfFile = {
  numberOfPages: number,
  filePath: string,
  base64: string // base64 encoded
}

const useScopePdf = (config: useScopePdfConfig) => {
  const [file, setFile] = useState<any>(null)
  const [logoBase64, setLogoBase64] = useState<string | null>(null)

  useEffect(() => {
    const getBase64Logo = async () => {
      try {
        // Note:: 
        // - Assets on iOS can be only be accessed this way if they are present in the "Resources" folder in Xcode
        // - On android they have to be in main/assets
        const imageUri = BlobUtil.fs.asset('CurbioWordmark.png');

        BlobUtil.fs.readFile(imageUri, 'base64')
          .then((base64String) => {
            setLogoBase64(base64String)
          })
          .catch(e => console.error(e))
      } catch (error) {
        throw('Error converting image to base64 in PDF.');
      }
    };

    getBase64Logo()  
  }, [])

  useEffect(() => {
    if (logoBase64 && config?.job) {
      initPdf()
    }
  }, [logoBase64, config?.job] )

  const initPdf = async () => {
    let options = {
      html: generatePdfHtml({tasks: config.job?.tasks}),
      fileName: config.fileName,
      directory: config.directory || 'Documents',
      base64: config.base64
    };

    let file = await RNHTMLtoPDF.convert(options)

    setFile(file)
  }
  
  const generatePdfHtml = ({tasks}) => {    
    const laborTasks = groupTasksByProposalSection(tasks?.filter((task) => task.isLabor && task.activeUnits))
  
    const materialsOnlyTasks = groupTasksByProposalSection(tasks?.filter((task) => task.isMaterials && !task.isLabor && task.activeUnits))

    const getMatterports = () => {
      return  (config.job?.matterportUrl1 || 
        config.job?.matterportUrl2 ||
        config.job?.matterportUrl3) && `
        <>
          <div>
            <h2>
              Matterport links
            </h2>
          </div>
  
          <div>
            ${config.job?.matterportUrl1
              ? `<a src={openJob?.data?.matterportUrl1}>Matterport 1</a>`
                : ""}
  
            ${config.job?.matterportUrl2
              ? `<a src={openJob?.data?.matterportUrl2}>Matterport 2</a>`
              : ""}
  
            ${config.job?.matterportUrl3
              ? `<a src={openJob?.data?.matterportUrl3}>Matterport 3</a>`
              : ""}
          </div>
        </>
      `
    }

    const getDescription = (task: ProjectTask, isLabor: boolean) => {
      const permitText = task.permit === Permits.Building ? "(Building Permit)" : task.permit === Permits.Trade ? "(Trade Permit)" : ""
      if (isLabor) {
        return task.materialsCost && task.laborAdjustment
          ? task.tradeName
            ? `[${task.tradeName}] ${task.description} (+Materials)`
            : `${task.description} (+Materials)` + permitText
          : task.tradeName
            ? `[${task.tradeName}] ${task.description}`
            : task.description + permitText;
      }
  
      return task.description + permitText;
    };
  
    const getSectionTitle = (task: ProjectTask) => {
      if (task.isInternalTask) return "";
      const itemName = task.proposalTaskDescription;
  
      const quantity = itemName.includes(`(${task.units})`) || task.quantity === "1" || !task.quantity
        ? ""
        : ` (${task.quantity})`;
  
      return `${itemName}${quantity}`;
    };

    const laborTasksHtml = Object.keys(laborTasks)?.map((proposalJobId) => {
      const _laborTasks = laborTasks[proposalJobId];

      const _tasks = _laborTasks?.map((task, i) => `
        <div class="task-wrapper">
          <div class="task-title-wrapper">
            <h4>${getSectionTitle(task)}</h4>
          </div>
          <ul class="">
            <li class="item">${getDescription(task, true)}</li>
          </ul>
        </div>
      `)

      return `
        <div class="proposal-title-wrapper">
          <h3>${_laborTasks[0]?.proposalJobName}</h3>
        </div>
        ${_tasks.join(" ")}
      `
  }).join(" ")

    const materialsOnlyHtml = Object.keys(materialsOnlyTasks)?.map(proposalJobId => {
      const _materialsTasks = materialsOnlyTasks[proposalJobId];

      const _tasks = _materialsTasks.map((task, i) => `
        <div class="task-wrapper">
          <div class="task-title-wrapper">
            <h3>${getSectionTitle(task)}</h3>
          </div>

          <ul>
            <li>${getDescription(task, false)}</li>
          </ul>
        </div>
      `)

      return  `
        <div class="proposal-title-wrapper">
          <h3>${_materialsTasks[0]?.proposalJobName}</h3>
        </div>
        ${_tasks.join(" ")}
      `
    }).join(" ")

    return `
      <html>
        <head>
          <style>  
            body {
              font-family: sans-serif;
            }        
            .header {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
            .labor-title-wrapper {
              -webkit-print-color-adjust: exact !important;
              background-color: ${colors.separator};
              padding: 0px 10px;
              margin-top: 0px;
              border-color: red;
              border-width: 1px;
              -webkit-print-color-adjust: exact !important;
            }
            .proposal-title-wrapper {
              -webkit-print-color-adjust: exact !important;
              background-color: ${colors.separator};
              padding: 0px 10px,
              padding-left: 20;
              margin-left: 20;
              margin-top: 0px;
              padding-top: 0px;
              margin-bottom: 0px;
              padding-bottom: 0px;
              border-color: blue;
              border-width: 1px;
              -webkit-print-color-adjust: exact !important;
            }
            .task-wrapper {
              margin-left: 10px;
              margin-vertical: 0;
              padding-horizontal: 0;
              border-color: green;
              border-width: 1px;
              -webkit-print-color-adjust: exact !important;
            }
            .task-title-wrapper {
              font-weight: bold;
              margin-left: 20px;
              margin-top: 0px;
              margin-bottom: 0;
              padding-horizontal: 0;
              border-color: yellow;
              border-width: 1px;
              -webkit-print-color-adjust: exact !important;
            }
            .item {
              -webkit-print-color-adjust: exact !important;
              margin-top: -20px;
              margin-vertical: 0px;
              padding-vertical: 0px;
              border-width: 1px;
              border-color: red;
            }
          </style>
        </head>
        
        <body>
          <div class="header">
            <img src="data:image/png;base64,${logoBase64}" style="width: 150px"/>

            <h2>Job Scope of Work</h2>
          </div>

          ${ laborTasksHtml.length > 0 ?
            `
              <div class="labor-title-wrapper">
                <h3>Labor Scope</h3>
              </div>
              ${laborTasksHtml}
            ` : ""
          }

          ${ materialsOnlyHtml.length > 0 ?
            `
              <div class="proposal-title-wrapper">
                <h3>Materials Scope</h3>
              </div>
              ${materialsOnlyHtml}
            ` : ""
          }

          ${getMatterports() ?? ""}
        </body>
      </html>
    `
  }

  return file as PdfFile
}

export default useScopePdf