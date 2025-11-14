const { ChatOpenAI } = require('@langchain/openai')
const { HumanMessage, SystemMessage } = require('@langchain/core/messages')

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY

const llm = new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    modelName: 'gpt-4o-mini',
    maxTokens: 500
})


async function askHealthQuestion(question, conversationHistory = []) {
    console.log('askHealthQuestion chamada com:', { question, historyLength: conversationHistory.length });
    
    const systemPrompt = new SystemMessage(`Você é um assistente especializado em saúde e medicina. 
Seu papel é ajudar usuários a entender termos médicos e tirar dúvidas sobre saúde de forma clara e acessível.
Sempre seja educado, empático e forneça informações precisas.
Se não souber algo, seja honesto e sugira consultar um profissional de saúde.
Nunca faça diagnósticos ou prescrições médicas.`);

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