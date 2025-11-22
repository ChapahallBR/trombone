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

    const handleAuth = async () => {
        console.log('[Login] handleAuth called', { isLogin, email, password, fullName, cpf });

        if (!email || !password) {
            console.log('[Login] Missing email or password');
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            if (isLogin) {
                console.log('[Login] Attempting login...');
                const { error } = await signIn(email, password);
                if (error) {
                    console.log('[Login] Login error:', error);
                    Alert.alert('Erro', error);
                    return;
                }
                console.log('[Login] Login successful, redirecting...');
                router.replace('/(tabs)');
            } else {
                console.log('[Login] Attempting signup...');
                if (!fullName) {
                    console.log('[Login] Missing fullName');
                    Alert.alert('Erro', 'Por favor, preencha seu nome completo.');
                    return;
                }
                console.log('[Login] Validating CPF:', cpf);
                if (!validateCPF(cpf)) {
                    console.log('[Login] CPF validation failed');
                    Alert.alert('Erro', 'CPF inválido.');
                    return;
                }
                console.log('[Login] CPF valid, calling signUp...');
                const { error } = await signUp(email, password, fullName, cpf);
                if (error) {
                    console.log('[Login] Signup error:', error);
                    Alert.alert('Erro', error);
                    return;
                }
                console.log('[Login] Signup successful!');
                Alert.alert('Sucesso', 'Conta criada com sucesso!');
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            console.error('[Login] Unexpected error:', error);
            Alert.alert('Erro', error.message || 'Ocorreu um erro.');
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
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
                    )}
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
