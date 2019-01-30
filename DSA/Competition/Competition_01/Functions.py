import itertools
import pandas as pd  
import re as re
import matplotlib.pyplot as plt   
import seaborn as sns; sns.set(style="ticks", color_codes=True)

_title = {"Mr": 1, "Miss": 2, "Mrs": 3, "Master": 4, "Rare": 5}
_age_points = [-99999, 0, 5, 12, 18, 35, 65, 200]
_age = {"Missing": 0, "Infant": 1, "Child": 2, "Teenager": 3, "Adult": 4, "Senior": 5}
_sex = {'female': 0, 'male': 1}
_fare_points = [-999999, 0,10,30,60,999999]
_fare = {"Inferior": 0, "Basic": 1, "Superior": 2, "Executive": 3}
_embarked = {'S': 0, 'C': 1, 'Q': 2}
_cabin = {'A': 0, 'C': 1, 'B': 2, 'E': 3, 'D': 4, 'G': 5, 'F': 6, 'U': 7, 'T': 8}
_score = {"a": 1, "c": 3, "b": 3, "e": 1, "d": 2, "g": 2, 
         "f": 4, "i": 1, "h": 4, "k": 5, "j": 8, "m": 3, 
         "l": 1, "o": 1, "n": 1, "q": 10, "p": 3, "s": 1, 
         "r": 1, "u": 1, "t": 1, "w": 4, "v": 4, "y": 4, 
         "x": 8, "z": 10}
_title = {"Capt": 0, "Col": 1, "Major": 2, "Jonkheer": 3, "Don": 4, "Sir": 5, "Dr": 6, 
          "Rev": 7, "the Countess": 8, "Mme": 9, "Mlle": 10, "Ms": 11, "Mr" : 12, "Mrs": 13, 
          "Miss": 14, "Master": 15, "Lady": 16, "Other": 17}

# Convert texto para um score por letra
def setLetter(data, column):
    data[column + '_Code'] = data[column].str.lower().map(_score).astype(int)

# Convert texto titulo para número
def setTitle(data, column, title):
    data[column] = data[column].fillna("Other")
    if data[column].any():
        data[title] = data[column].map(lambda name:name.split(',')[1].split('.')[0].strip())
        data[title + '_Code'] = data[title].map(_title)
    
# Convert texto embarque para número
def setEmbarked(data, column):
    if data[column].any():
        data[column + '_Code'] = data[column].map(_embarked)
          
# Convert texto cabine para número
def setCabin(data, column):
    if data[column].any():
        data[column + '_Code'] = data[column].map(_cabin).astype(int)       
    
# Convert texto sexo para número
def setSex(data, column):
    if data[column].any():
        data[column + '_Code'] = data[column].map(_sex).astype(int)
    
# Convert valor da tarifa
def setFare(data, column):
    data[column] = data[column].fillna(0)
    if data[column].any():
        data[column + '_Code'] = pd.cut(data[column], _fare_points, labels=False)
    
# Convert classes de idades
def setAge(data, column):
    data[column] = data[column].fillna(-0.5)
    if data[column].any():
        data[column + '_Code'] = pd.cut(data[column], _age_points, labels=False)  
    
# Converte o nome para o título
def getTitle(name):
    search = re.search(' ([A-Za-z]+)\.', name)
    if search:
        return search.group(1)
    return ""
       
# Verifica a correlação entre as variáveis
def getCorr(data):
    #sns.heatmap(data.corr(), cmap='BuGn')
    colormap = plt.cm.viridis
    plt.figure(figsize=(64,64))
    plt.title('Correlation between Features', y=1.05, size = 15)
    sns.heatmap(data.corr(),
                linewidths=0.1, 
                vmax=1.0, 
                square=True, 
                cmap=colormap, 
                linecolor='white', 
                annot=True)
    
def correlation_heatmap(data):
    _ , ax = plt.subplots(figsize =(14, 12))
    colormap = sns.diverging_palette(220, 10, as_cmap = True)
    
    _ = sns.heatmap(
        data.corr(), 
        cmap = colormap,
        square=True, 
        cbar_kws={'shrink':.9 }, 
        ax=ax,
        annot=True, 
        linewidths=0.1,vmax=1.0, linecolor='white',
        annot_kws={'fontsize':12 }
    )
    
    plt.title('Pearson Correlation of Features', y=1.05, size=15)    
    
# Cria um relatório do tipo Scatter
def scatter(data, field, column):
    plt.figure()
    plt.scatter(data[field], data[column])
    plt.ylabel(column)
    plt.xlabel(field)
    plt.legend()
      
# Cria um relatório do tipo Bar
def plot(data, field, column):
    ax = data[column].value_counts().plot(kind='bar', figsize=(10,7), color="indigo", fontsize=13, zorder=2);
    ax.set_alpha(0.8)
    ax.set_title("Titanic - " + field + ' x ' + column, fontsize=18)
    ax.set_xlabel(column, fontsize=18);
    ax.set_ylabel(field, fontsize=18);
    ax.set_yticks(data[field])

    # create a list to collect the plt.patches data
    totals = []

    # find the values and append to list
    for i in ax.patches:
        totals.append(i.get_height())

    # set individual bar lables using above list
    total = sum(totals)

    # set individual bar lables using above list
    for i in ax.patches:
        # get_x pulls left or right; get_height pushes up or down
        ax.text(i.get_x()+.15, i.get_height()-25, \
            str(round((i.get_height()/total)*100, 2))+'%', fontsize=12,
                color='white')
    return ax

def output(output, dataset, filename, field1, field2):
    df_output = pd.DataFrame()
    df_output[field1] = dataset[field1].astype(int)
    df_output[field2] = output.astype(int)
    
    output = './Predictions/' + filename + '.csv'
    df_output[[field1,field2]].to_csv(output, index=False)    
    return 'ok - arquivo gerado: ' + filename