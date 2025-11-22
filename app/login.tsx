import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { validateCPF, formatCPF } from '@/utils/cpf';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn, signUp, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [fullName, setFullName] = useState('');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAuth = async () => {
        setErrorMessage(null);
        console.log('[Login] handleAuth called', { isLogin, email, password, fullName, cpf });

        if (!email || !password) {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            if (isLogin) {
                console.log('[Login] Attempting login...');
                const { error } = await signIn(email, password);
                if (error) {
                    console.log('[Login] Login error:', error);
                    setErrorMessage(error);
                    Alert.alert('Erro de Login', error);
                    return;
                }
                console.log('[Login] Login successful, redirecting...');
                router.replace('/(tabs)/mine');
            } else {
                console.log('[Login] Attempting signup...');
                if (!fullName) {
                    setErrorMessage('Por favor, preencha seu nome completo.');
                    return;
                }
                console.log('[Login] Validating CPF:', cpf);
                if (!validateCPF(cpf)) {
                    setErrorMessage('CPF inválido. Verifique os números.');
                    return;
                }
                console.log('[Login] CPF valid, calling signUp...');
                const { error } = await signUp(email, password, fullName, cpf);
                if (error) {
                    console.log('[Login] Signup error:', error);
                    setErrorMessage(error);
                    Alert.alert('Erro de Cadastro', error);
                    return;
                }
                console.log('[Login] Signup successful!');
                Alert.alert('Sucesso', 'Conta criada com sucesso!');
                router.replace('/(tabs)/mine');
            }
        } catch (error: any) {
            console.error('[Login] Unexpected error:', error);
            const msg = error.message || 'Ocorreu um erro inesperado.';
            setErrorMessage(msg);
            Alert.alert('Erro', msg);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{isLogin ? 'Bem-vindo' : 'Criar Conta'}</Text>

                {errorMessage && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#fff" />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                )}

                {!isLogin && (
                    <TextInput
                        style={[styles.input, loading && styles.inputDisabled]}
                        placeholder="Nome Completo"
                        value={fullName}
                        onChangeText={setFullName}
                        editable={!loading}
                    />
                )}

                <TextInput
                    style={[styles.input, loading && styles.inputDisabled]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                />

                {!isLogin && (
                    <TextInput
                        style={[styles.input, loading && styles.inputDisabled]}
                        placeholder="CPF"
                        value={cpf}
                        onChangeText={(text) => setCpf(formatCPF(text))}
                        keyboardType="numeric"
                        maxLength={14}
                        editable={!loading}
                    />
                )}

                <TextInput
                    style={[styles.input, loading && styles.inputDisabled]}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleAuth}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setIsLogin(!isLogin);
                        setErrorMessage(null);
                    }}
                    style={styles.switchButton}
                    disabled={loading}
                >
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
    errorContainer: {
        backgroundColor: '#FF3B30',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    inputDisabled: {
        opacity: 0.7,
        backgroundColor: '#f0f0f0',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
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
