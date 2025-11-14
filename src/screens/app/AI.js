import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { askHealthQuestion } = require('../../services/openai');

export default function AI() {
  const [messages, setMessages] = React.useState([]);
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollViewRef = React.useRef(null);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    const currentQuestion = inputText;
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log('Enviando pergunta:', currentQuestion);
      
      // Preparar histórico de conversação para contexto
      const { HumanMessage, AIMessage } = require('@langchain/core/messages');
      const conversationHistory = messages.map(msg => {
        if (msg.sender === 'user') {
          return new HumanMessage(msg.text);
        } else {
          return new AIMessage(msg.text);
        }
      });

      console.log('Histórico preparado, chamando API...');
      
      // Chamar a API da OpenAI
      const response = await askHealthQuestion(currentQuestion, conversationHistory);
      
      console.log('Resposta recebida:', response);

      if (!response || !response.answer) {
        throw new Error('Resposta inválida da API');
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: response.answer,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      console.log('Mensagem adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao obter resposta da IA:', error);
      console.error('Stack trace:', error.stack);
      
      let errorText = 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.';
      let alertTitle = 'Erro';
      let alertMessage = `Erro: ${error.message || 'Desconhecido'}`;
      
      // Verificar se é erro de quota
      if (error.message && error.message.includes('quota')) {
        errorText = 'O serviço de IA está temporariamente indisponível devido a limite de uso. Por favor, tente novamente mais tarde.';
        alertTitle = 'Serviço Indisponível';
        alertMessage = 'A cota da API OpenAI foi excedida. Verifique seu plano e dados de faturamento em platform.openai.com';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      Alert.alert(alertTitle, alertMessage);
    } finally {
      setIsLoading(false);
      console.log('Loading finalizado');
    }
  };

  React.useEffect(() => {
    // Scroll para o final quando há novas mensagens
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assistente</Text>
      </View>

      {/* Messages Area */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>Comece uma conversa</Text>
            <Text style={styles.emptySubtext}>Tire suas dúvidas sobre saúde</Text>
          </View>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}
          >
            {message.sender === 'ai' && (
              <View style={styles.aiIcon}>
                <Ionicons name="medkit" size={16} color="#FFFFFF" />
              </View>
            )}
            <View style={[
              styles.messageContent,
              message.sender === 'user' ? styles.userContent : styles.aiContent
            ]}>
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userText : styles.aiText
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.aiIcon}>
              <Ionicons name="medkit" size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.messageContent, styles.aiContent]}>
              <ActivityIndicator size="small" color="#6B7280" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Buscar termos..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.disclaimer}>
          O ChatGPT pode cometer erros. É sempre recomendável verificar informações importantes.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#2D1C87',
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  messageBubble: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D1C87',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
  },
  userContent: {
    backgroundColor: '#6366F1',
    borderTopRightRadius: 4,
  },
  aiContent: {
    backgroundColor: '#E5E7EB',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#1F2937',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D1C87',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  disclaimer: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
