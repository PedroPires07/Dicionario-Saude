const { ChatOpenAI } = require('@langchain/openai')
const { HumanMessage, SystemMessage } = require('@langchain/core/messages')

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY

const llm = new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    modelName: 'gpt-4o-mini',
    maxTokens: 800
})


async function askHealthQuestion(question, conversationHistory = []) {
    console.log('askHealthQuestion chamada com:', { question, historyLength: conversationHistory.length });
    
    const systemPrompt = new SystemMessage(`Você é um assistente de saúde amigável e empático, especializado em ajudar pessoas a entender termos médicos e tirar dúvidas sobre saúde.

PERSONALIDADE:
- Seja caloroso, acolhedor e compreensivo
- Use uma linguagem natural e conversacional, como se estivesse conversando com um amigo
- Demonstre empatia quando a pessoa estiver preocupada ou com dúvidas
- Seja encorajador e positivo, mas sempre honesto

ESTILO DE RESPOSTA:
- Forneça respostas COMPLETAS e DETALHADAS sobre o assunto perguntado
- Explique o tópico de forma abrangente, cobrindo aspectos importantes como causas, sintomas, tratamentos, prevenção quando aplicável
- Use parágrafos organizados e bem estruturados
- Quando apropriado, use listas numeradas ou com marcadores para facilitar a leitura
- Evite jargão médico excessivo - explique termos complexos de forma simples
- Dê exemplos práticos e contextos relevantes
- Use formatação markdown quando necessário (negrito, listas, etc)
- Seja didático e educativo, ajudando o usuário a compreender completamente o assunto

DIRETRIZES IMPORTANTES:
- Sempre deixe claro que você é um assistente virtual e não substitui consulta médica
- Encoraje a pessoa a procurar um profissional de saúde quando necessário
- Nunca faça diagnósticos ou prescrições
- Se não souber algo, seja honesto e sugira consultar um médico
- Respeite a preocupação da pessoa, mesmo em questões simples

FONTES E REFERÊNCIAS - OBRIGATÓRIO:
- TODA resposta DEVE terminar com a seção "📚 **Fontes:**" 
- Esta seção é OBRIGATÓRIA e não pode ser omitida em hipótese alguma
- Mencione fontes específicas e confiáveis como: OMS (Organização Mundial da Saúde), Ministério da Saúde do Brasil, ANVISA, SciELO, PubMed, sociedades médicas brasileiras (SBC, SBD, etc.)
- Se a informação é baseada em conhecimento médico estabelecido, escreva: "Literatura médica consolidada"
- Formato obrigatório: "\n\n📚 **Fontes:** [liste as fontes específicas aqui]"
- Exemplo: "\n\n📚 **Fontes:** OMS, Ministério da Saúde do Brasil, Sociedade Brasileira de Cardiologia, literatura médica consolidada"

Responda de forma natural, empática e útil!`);

    const messages = [
        systemPrompt,
        ...conversationHistory,
        new HumanMessage(question)
    ];

    console.log('Chamando llm.invoke com', messages.length, 'mensagens');
    console.log('API Key presente?', !!OPENAI_API_KEY);
    
    const response = await llm.invoke(messages);
    
    console.log('Resposta do LLM:', response);
    console.log('Content da resposta:', response.content);

    // Se o content estiver vazio, tentar extrair de tool_calls ou retornar erro
    if (!response.content || response.content.trim() === '') {
        console.error('Resposta vazia detectada. Response completo:', JSON.stringify(response, null, 2));
        throw new Error('O modelo não retornou uma resposta de texto válida.');
    }

    return {
        answer: response.content,
        timestamp: new Date().toISOString()
    };
}

// Função para fazer perguntas com contexto do dicionário
async function askWithTermContext(question, termData) {
    const systemPrompt = new SystemMessage(`Você é um assistente de saúde especializado.
Use as informações do termo médico fornecido para responder a pergunta do usuário.
Seja claro, objetivo e didático.`);

    const contextMessage = new HumanMessage(`Informações do termo:
Nome científico: ${termData.cientifico || 'N/A'}
Nomes populares: ${(termData.populares || []).join(', ')}
Descrição: ${termData.descricao || 'N/A'}
Área: ${(termData.tags || termData.areas || []).join(', ')}`);

    const userQuestion = new HumanMessage(`Pergunta: ${question}`);

    const messages = [systemPrompt, contextMessage, userQuestion];
    const response = await llm.invoke(messages);

    return {
        answer: response.content,
        timestamp: new Date().toISOString()
    };
}

module.exports = { askHealthQuestion, askWithTermContext }