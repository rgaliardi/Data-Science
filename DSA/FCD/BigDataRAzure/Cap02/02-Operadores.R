# Operadores Básicos, Relacionais e Lógicos em R

# Obs: Caso tenha problemas com a acentuação, consulte este link:
# https://support.rstudio.com/hc/en-us/articles/200532197-Character-Encoding

# Configurando o diretório de trabalho
# Coloque entre aspas o diretório de trabalho que você está usando no seu computador
# Não use diretórios com espaço no nome
setwd("C:/FCD/BigDataRAzure/Cap02")
getwd()

# Operadores Básicos

# Soma
7 + 7

# Subtração
7 - 4

# Multiplicação
5 * 5

# Divisão
6 / 6

# Potência
3^2
3**2

# Módulo
16 %% 3 


# Operadores Relacionais

# Atribuindo variáveis
x = 7
y = 5

# Operadores
x > 8
x < 8
x <= 8
x >= 8
x == 8
x != 8


# Operadores lógicos

# And
(x==8) & (x==6)
(x==7) & (x>=5)
(x==8) & (x==7)

# Or
(x==8) | (x>5)
(x==8) | (x>=5)

# Not
x > 8
print(!x > 8)




