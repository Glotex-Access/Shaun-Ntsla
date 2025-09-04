package com.shaunntsala.phiritonalonline.ui.chat

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

data class AIMessage(
    val id: String,
    val message: String,
    val isFromAI: Boolean,
    val timestamp: String,
    val messageType: AIMessageType = AIMessageType.TEXT
)

enum class AIMessageType {
    TEXT, SUGGESTION, MODERATION_ALERT
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShaunAIScreen() {
    var messageText by remember { mutableStateOf("") }
    var isTyping by remember { mutableStateOf(false) }
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()
    
    val messages = remember {
        mutableStateListOf(
            AIMessage(
                "1", 
                "Hello! I'm Shaun AI, your personal assistant for Phiritonal Online. I can help you with questions, suggest quick replies, and help moderate community discussions. How can I assist you today?", 
                true, 
                "Now"
            ),
            AIMessage(
                "2",
                "I can help you with:\n• Answering general questions\n• Suggesting conversation topics\n• Community moderation\n• Quick reply suggestions\n• Local Heilbron information",
                true,
                "Now",
                AIMessageType.SUGGESTION
            )
        )
    }
    
    val quickSuggestions = listOf(
        "What's happening in Heilbron today?",
        "Help me start a conversation",
        "Community guidelines",
        "Local weather",
        "School events",
        "Safety tips"
    )
    
    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Card(
                    modifier = Modifier.size(48.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Android,
                            contentDescription = "Shaun AI",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.width(16.dp))
                
                Column {
                    Text(
                        text = "Shaun AI Assistant",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .padding(end = 4.dp)
                        ) {
                            Card(
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.tertiary
                                ),
                                modifier = Modifier.fillMaxSize(),
                                shape = RoundedCornerShape(4.dp)
                            ) {}
                        }
                        Text(
                            text = "Online • Ready to help",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                        )
                    }
                }
            }
        }
        
        // Messages
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { message ->
                AIMessageBubble(message = message)
            }
            
            if (isTyping) {
                item {
                    TypingIndicator()
                }
            }
        }
        
        // Quick suggestions (if no messages from user yet)
        if (messages.none { !it.isFromAI }) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = "Quick suggestions:",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                    
                    quickSuggestions.chunked(2).forEach { row ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            row.forEach { suggestion ->
                                AssistChip(
                                    onClick = {
                                        messageText = suggestion
                                    },
                                    label = { 
                                        Text(
                                            text = suggestion,
                                            fontSize = 12.sp
                                        ) 
                                    },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                    }
                }
            }
        }
        
        // Message input
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.Bottom
            ) {
                OutlinedTextField(
                    value = messageText,
                    onValueChange = { messageText = it },
                    placeholder = { Text("Ask Shaun AI anything...") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(24.dp),
                    maxLines = 3
                )
                
                Spacer(modifier = Modifier.width(8.dp))
                
                FloatingActionButton(
                    onClick = {
                        if (messageText.isNotBlank()) {
                            // Add user message
                            messages.add(
                                AIMessage(
                                    id = (messages.size + 1).toString(),
                                    message = messageText,
                                    isFromAI = false,
                                    timestamp = "Now"
                                )
                            )
                            
                            val userMessage = messageText
                            messageText = ""
                            isTyping = true
                            
                            // Simulate AI response
                            coroutineScope.launch {
                                kotlinx.coroutines.delay(2000)
                                isTyping = false
                                
                                val aiResponse = generateAIResponse(userMessage)
                                messages.add(aiResponse)
                                
                                listState.animateScrollToItem(messages.size - 1)
                            }
                            
                            coroutineScope.launch {
                                listState.animateScrollToItem(messages.size - 1)
                            }
                        }
                    },
                    modifier = Modifier.size(48.dp),
                    containerColor = MaterialTheme.colorScheme.primary
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Send",
                        tint = MaterialTheme.colorScheme.onPrimary
                    )
                }
            }
        }
    }
}

@Composable
fun AIMessageBubble(message: AIMessage) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (message.isFromAI) Arrangement.Start else Arrangement.End
    ) {
        Card(
            modifier = Modifier.widthIn(max = 280.dp),
            colors = CardDefaults.cardColors(
                containerColor = when {
                    !message.isFromAI -> MaterialTheme.colorScheme.primary
                    message.messageType == AIMessageType.SUGGESTION -> MaterialTheme.colorScheme.tertiaryContainer
                    message.messageType == AIMessageType.MODERATION_ALERT -> MaterialTheme.colorScheme.errorContainer
                    else -> MaterialTheme.colorScheme.secondaryContainer
                }
            ),
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (message.isFromAI) 4.dp else 16.dp,
                bottomEnd = if (message.isFromAI) 16.dp else 4.dp
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                if (message.isFromAI) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(bottom = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Android,
                            contentDescription = "AI",
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Shaun AI",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
                
                Text(
                    text = message.message,
                    fontSize = 14.sp,
                    color = when {
                        !message.isFromAI -> MaterialTheme.colorScheme.onPrimary
                        message.messageType == AIMessageType.SUGGESTION -> MaterialTheme.colorScheme.onTertiaryContainer
                        message.messageType == AIMessageType.MODERATION_ALERT -> MaterialTheme.colorScheme.onErrorContainer
                        else -> MaterialTheme.colorScheme.onSecondaryContainer
                    },
                    lineHeight = 20.sp
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = message.timestamp,
                    fontSize = 10.sp,
                    color = when {
                        !message.isFromAI -> MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.7f)
                        message.messageType == AIMessageType.SUGGESTION -> MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.7f)
                        message.messageType == AIMessageType.MODERATION_ALERT -> MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.7f)
                        else -> MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f)
                    }
                )
            }
        }
    }
}

@Composable
fun TypingIndicator() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Start
    ) {
        Card(
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.secondaryContainer
            ),
            shape = RoundedCornerShape(16.dp)
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Android,
                    contentDescription = "AI",
                    modifier = Modifier.size(16.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Shaun AI is typing...",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSecondaryContainer,
                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                )
            }
        }
    }
}

private fun generateAIResponse(userMessage: String): AIMessage {
    val responses = when {
        userMessage.contains("weather", ignoreCase = true) -> 
            "The weather in Heilbron today is sunny with a high of 24°C. Perfect weather for outdoor activities! ☀️"
        
        userMessage.contains("school", ignoreCase = true) -> 
            "I can help you with school-related questions! Are you looking for information about a specific school in Heilbron, or do you need help with academic topics?"
        
        userMessage.contains("hello", ignoreCase = true) || userMessage.contains("hi", ignoreCase = true) -> 
            "Hello there! 👋 I'm here to help you with anything you need. Feel free to ask me questions about Heilbron, school activities, or just chat!"
        
        userMessage.contains("help", ignoreCase = true) -> 
            "I'm here to help! I can assist you with:\n• Local information about Heilbron\n• School and community updates\n• Conversation suggestions\n• General questions\n\nWhat would you like to know?"
        
        userMessage.contains("community", ignoreCase = true) -> 
            "Our community guidelines promote respect, kindness, and constructive conversation. Remember to:\n• Be respectful to all members\n• No spam or inappropriate content\n• Keep discussions relevant\n• Help create a positive environment"
        
        else -> 
            "That's an interesting question! While I'm still learning, I'm here to help with information about Heilbron, school activities, and general assistance. Is there something specific I can help you with?"
    }
    
    return AIMessage(
        id = System.currentTimeMillis().toString(),
        message = responses,
        isFromAI = true,
        timestamp = "Now"
    )
}