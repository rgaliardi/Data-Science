# Lista de Exercícios - Capítulo 2

# Obs: Caso tenha problemas com a acentuação, consulte este link:
# https://support.rstudio.com/hc/en-us/articles/200532197-Character-Encoding

# Configurando o diretório de trabalho
# Coloque entre aspas o diretório de trabalho que você está usando no seu computador
# Não use diretórios com espaço no nome
setwd("P:/GitHub/Data-Science/DSA/FCD/BigDataRAzure/Cap02")
getwd()

# Exercício 1 - Crie um vetor com 30 números inteiros
vector1 <- c(1:30)
vector1

# Exercício 2 - Crie uma matriz com 4 linhas e 4 colunas preenchida com números inteiros
matrix1 <- matrix(c(1:16), nc=4, nr=4)
matrix1

# Exercício 3 - Crie uma lista unindo o vetor e matriz criados anteriormente
list1 <- list(vector1, matrix1)
list1

# Exercício 4 - Usando a função read.table() leia o arquivo do link abaixo para uma dataframe
# http://data.princeton.edu/wws509/datasets/effort.dat
effort <- data.frame(read.table("http://data.princeton.edu/wws509/datasets/effort.dat", header = TRUE))
effort

# Exercício 5 - Transforme o dataframe anterior, em um dataframe nomeado com os seguintes labels:
# c("config", "esfc", "chang")
names(effort) = c("config", "esfc", "chang")
effort

# Exercício 6 - Imprima na tela o dataframe iris, verifique quantas dimensões existem no dataframe iris e imprima um resumo do dataset
iris1 <- data.frame(iris)
head(iris1)
dim(iris1)
summary(iris1)


# Exercício 7 - Crie um plot simples usando as duas primeiras colunas do dataframe iris
plot(iris1$Sepal.Length, iris1$Sepal.Width)

# Exercício 8 - Usando a função subset, crie um novo dataframe com o conjunto de dados do dataframe iris em que Sepal.Length > 7
# Dica: consulte o help para aprender como usar a função subset()
?subset
iris2 <- subset(iris1, Sepal.Length > 7)
iris2

# Exercícios 9 (Desafio) - Crie um dataframe que seja cópia do dataframe iris e usando a função slice(), divida o dataframe em um subset de 15 linhas
# Dica 1: Você vai ter que instalar e carregar o pacote dplyr
# Dica 2: Consulte o help para aprender como usar a função slice()
library(dplyr)
?slice
desafio <- slice(iris1, 1:15)
desafio

# Exercícios 10 - Use a função filter no seu novo dataframe criado no item anterior e retorne apenas valores em que Sepal.Length > 6
# Dica: Use o RSiteSearch para aprender como usar a função filter
?data.frame
filter(desafio, Sepal.Length > 6)

