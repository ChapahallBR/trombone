import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/template';
import { validateCPF, formatCPF } from '@/utils/cpf';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const { signInWithPassword, signUpWithPassword, signInWithGoogle, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [fullName, setFullName] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setAuthLoading(true);
        try {
            if (isLogin) {
                const { error } = await signInWithPassword(email, password);
                if (error) throw new Error(error);
            } else {
                if (!validateCPF(cpf)) {
                    Alert.alert('Erro', 'CPF inválido.');
                    setAuthLoading(false);
                    return;
                }
                const { error } = await signUpWithPassword(email, password, { cpf, full_name: fullName });
                if (error) throw new Error(error);
                Alert.alert('Sucesso', 'Conta criada com sucesso! Verifique seu email.');
                setIsLogin(true);
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Ocorreu um erro.');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setAuthLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) throw new Error(error);
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Falha no login com Google.');
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{isLogin ? 'Bem-vindo' : 'Criar Conta'}</Text>

                {!isLogin && (
                    <TextInput
                        style={styles.input}
                        placeholder="Nome Completo"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                {!isLogin && (
                    <TextInput
                        style={styles.input}
                        placeholder="CPF"
                        value={cpf}
                        onChangeText={(text) => setCpf(formatCPF(text))}
                        keyboardType="numeric"
                        maxLength={14}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAuth}
                    disabled={authLoading || loading}
                >
                    {authLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.googleButton]}
                    onPress={handleGoogleLogin}
                    disabled={authLoading || loading}
                >
                    <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>Entrar com Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
                    <Text style={styles.switchText}>
                        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    googleButton: {
        backgroundColor: '#DB4437',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    switchButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    switchText: {
        color: '#007AFF',
    },
});
