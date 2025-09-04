package com.shaunntsala.phiritonalonline.ui.chat

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class PrivateChatItem(
    val id: String,
    val name: String,
    val lastMessage: String,
    val lastMessageTime: String,
    val unreadCount: Int = 0,
    val isOnline: Boolean = false,
    val profilePicture: String? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrivateChat() {
    var searchQuery by remember { mutableStateOf("") }
    var showFriendRequests by remember { mutableStateOf(false) }
    
    val privateChatItems = remember {
        listOf(
            PrivateChatItem(
                "1", "Sarah Smith", "Thanks for the help!", "2 min ago", 2, true
            ),
            PrivateChatItem(
                "2", "Mike Johnson", "See you tomorrow 👋", "1 hour ago", 0, true
            ),
            PrivateChatItem(
                "3", "Lisa Brown", "That sounds great!", "3 hours ago", 1, false
            ),
            PrivateChatItem(
                "4", "David Wilson", "Voice message", "Yesterday", 0, false
            ),
            PrivateChatItem(
                "5", "Emma Davis", "📸 Photo", "2 days ago", 0, true
            ),
            PrivateChatItem(
                "6", "John Doe", "How are you doing?", "1 week ago", 0, false
            )
        )
    }
    
    val friendRequests = remember {
        listOf(
            "Alex Thompson",
            "Maria Garcia",
            "James Wilson"
        )
    }
    
    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.secondaryContainer
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Private Chats",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                        Text(
                            text = "Personal conversations",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f)
                        )
                    }
                    
                    Row {
                        IconButton(
                            onClick = { /* Handle search */ }
                        ) {
                            Icon(
                                Icons.Default.Search,
                                contentDescription = "Search",
                                tint = MaterialTheme.colorScheme.onSecondaryContainer
                            )
                        }
                        
                        IconButton(
                            onClick = { /* Handle add friend */ }
                        ) {
                            Icon(
                                Icons.Default.PersonAdd,
                                contentDescription = "Add Friend",
                                tint = MaterialTheme.colorScheme.onSecondaryContainer
                            )
                        }
                    }
                }
            }
        }
        
        // Friend requests notification
        if (friendRequests.isNotEmpty()) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .clickable { showFriendRequests = !showFriendRequests },
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.tertiaryContainer
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.PersonAdd,
                            contentDescription = "Friend Requests",
                            tint = MaterialTheme.colorScheme.onTertiaryContainer
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "Friend Requests",
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.onTertiaryContainer
                            )
                            Text(
                                text = "${friendRequests.size} pending requests",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.7f)
                            )
                        }
                    }
                    
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.error
                        )
                    ) {
                        Text(
                            text = friendRequests.size.toString(),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            color = MaterialTheme.colorScheme.onError,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
        
        // Friend requests list (expandable)
        if (showFriendRequests && friendRequests.isNotEmpty()) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    friendRequests.forEach { requester ->
                        FriendRequestItem(
                            name = requester,
                            onAccept = { /* Handle accept */ },
                            onDecline = { /* Handle decline */ }
                        )
                        if (requester != friendRequests.last()) {
                            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        // Private chat list
        LazyColumn(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(privateChatItems) { chatItem ->
                PrivateChatItemCard(
                    chatItem = chatItem,
                    onClick = { /* Navigate to chat */ }
                )
            }
        }
    }
}

@Composable
fun FriendRequestItem(
    name: String,
    onAccept: () -> Unit,
    onDecline: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Card(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = name.first().toString(),
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Column {
                Text(
                    text = name,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Wants to connect",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
        
        Row {
            TextButton(
                onClick = onDecline,
                colors = ButtonDefaults.textButtonColors(
                    contentColor = MaterialTheme.colorScheme.error
                )
            ) {
                Text("Decline")
            }
            
            Button(
                onClick = onAccept,
                modifier = Modifier.padding(start = 8.dp)
            ) {
                Text("Accept")
            }
        }
    }
}

@Composable
fun PrivateChatItemCard(
    chatItem: PrivateChatItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Profile picture
            Box {
                Card(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = chatItem.name.first().toString(),
                            color = MaterialTheme.colorScheme.onPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                    }
                }
                
                // Online indicator
                if (chatItem.isOnline) {
                    Card(
                        modifier = Modifier
                            .size(14.dp)
                            .offset(x = 2.dp, y = 2.dp)
                            .align(Alignment.BottomEnd),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.tertiary
                        ),
                        shape = CircleShape
                    ) {}
                }
            }
            
            Spacer(modifier = Modifier.width(16.dp))
            
            // Chat info
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = chatItem.name,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Text(
                        text = chatItem.lastMessageTime,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = chatItem.lastMessage,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                        modifier = Modifier.weight(1f)
                    )
                    
                    if (chatItem.unreadCount > 0) {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.error
                            )
                        ) {
                            Text(
                                text = chatItem.unreadCount.toString(),
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                color = MaterialTheme.colorScheme.onError,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}