package com.shaunntsala.phiritonalonline

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.shaunntsala.phiritonalonline.ui.onboarding.*
import com.shaunntsala.phiritonalonline.ui.chat.*
import com.shaunntsala.phiritonalonline.ui.theme.PhiritonalOnlineTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PhiritonalOnlineTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    PhiritonalApp()
                }
            }
        }
    }
}

@Composable
fun PhiritonalApp() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "welcome"
    ) {
        composable("welcome") {
            WelcomeScreen(
                onContinue = { navController.navigate("language_selection") }
            )
        }
        composable("language_selection") {
            LanguageSelectionScreen(
                onLanguageSelected = { navController.navigate("auth") }
            )
        }
        composable("auth") {
            AuthScreen(
                onAuthSuccess = { navController.navigate("main_chat") }
            )
        }
        composable("profile_setup") {
            ProfileSetupScreen(
                onComplete = { navController.navigate("main_chat") }
            )
        }
        composable("main_chat") {
            MainChatScreen(navController = navController)
        }
    }
}