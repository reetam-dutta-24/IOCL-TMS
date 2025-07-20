import {
  ApiClient,
  EnvelopesApi,
  type EnvelopeDefinition,
  type Document,
  type Signer,
  type SignHere,
  type Tabs,
  type Recipients,
} from "docusign-esign"

const apiClient = new ApiClient()
apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH || "https://demo.docusign.net/restapi")

interface DocuSignConfig {
  integrationKey: string
  userId: string
  accountId: string
  privateKey: string
}

const config: DocuSignConfig = {
  integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY!,
  userId: process.env.DOCUSIGN_USER_ID!,
  accountId: process.env.DOCUSIGN_ACCOUNT_ID!,
  privateKey: process.env.DOCUSIGN_PRIVATE_KEY!,
}

export async function createEnvelope(documentData: {
  documentName: string
  documentContent: string
  signerEmail: string
  signerName: string
  subject: string
}) {
  try {
    // Configure JWT authentication
    apiClient.configureJWTAuthorizationFlow(config.privateKey, config.integrationKey, config.userId, 3600)

    const envelopesApi = new EnvelopesApi(apiClient)

    // Create document
    const document: Document = {
      documentBase64: Buffer.from(documentData.documentContent).toString("base64"),
      name: documentData.documentName,
      fileExtension: "pdf",
      documentId: "1",
    }

    // Create signer
    const signer: Signer = {
      email: documentData.signerEmail,
      name: documentData.signerName,
      recipientId: "1",
      routingOrder: "1",
    }

    // Create signature tab
    const signHere: SignHere = {
      documentId: "1",
      pageNumber: "1",
      recipientId: "1",
      tabLabel: "SignHereTab",
      xPosition: "195",
      yPosition: "147",
    }

    const tabs: Tabs = {
      signHereTabs: [signHere],
    }

    signer.tabs = tabs

    // Create recipients
    const recipients: Recipients = {
      signers: [signer],
    }

    // Create envelope definition
    const envelopeDefinition: EnvelopeDefinition = {
      emailSubject: documentData.subject,
      documents: [document],
      recipients: recipients,
      status: "sent",
    }

    // Create envelope
    const result = await envelopesApi.createEnvelope(config.accountId, {
      envelopeDefinition: envelopeDefinition,
    })

    return {
      envelopeId: result.envelopeId,
      status: result.status,
      uri: result.uri,
    }
  } catch (error) {
    console.error("Error creating DocuSign envelope:", error)
    throw error
  }
}

export async function getEnvelopeStatus(envelopeId: string) {
  try {
    const envelopesApi = new EnvelopesApi(apiClient)
    const result = await envelopesApi.getEnvelope(config.accountId, envelopeId)

    return {
      status: result.status,
      completedDateTime: result.completedDateTime,
      sentDateTime: result.sentDateTime,
    }
  } catch (error) {
    console.error("Error getting envelope status:", error)
    throw error
  }
}

export async function downloadSignedDocument(envelopeId: string, documentId = "1") {
  try {
    const envelopesApi = new EnvelopesApi(apiClient)
    const result = await envelopesApi.getDocument(config.accountId, envelopeId, documentId)

    return result
  } catch (error) {
    console.error("Error downloading signed document:", error)
    throw error
  }
}
