package com.shaunntsala.phiritonalonline.ui.chat

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainChatScreen(navController: NavController) {
    var selectedTab by remember { mutableStateOf(0) }
    
    val tabs = listOf(
        Triple("Community", Icons.Default.Group, "Public chat for everyone"),
        Triple("Private", Icons.Default.Chat, "Personal conversations"),
        Triple("Schools", Icons.Default.School, "School communities"),
        Triple("Shaun AI", Icons.Default.Android, "AI Assistant"),
        Triple("Profile", Icons.Default.Person, "Your profile & settings")
    )
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                tabs.forEachIndexed { index, (title, icon, _) ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        icon = { 
                            Icon(
                                icon, 
                                contentDescription = title,
                                modifier = Modifier.size(24.dp)
                            ) 
                        },
                        label = { 
                            Text(
                                text = title,
                                maxLines = 1
                            ) 
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.primary,
                            selectedTextColor = MaterialTheme.colorScheme.primary,
                            indicatorColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            when (selectedTab) {
                0 -> CommunityChat()
                1 -> PrivateChat()
                2 -> SchoolsChat()
                3 -> ShaunAIScreen()
                4 -> ProfileScreen()
            }
        }
    }
}