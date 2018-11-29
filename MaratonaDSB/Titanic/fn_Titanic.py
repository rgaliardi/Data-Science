# Importando as bibliotecas
import pandas as pd  

_title = {
    "Capt": "Officer",
    "Col": "Officer",
    "Major": "Officer",
    "Jonkheer": "Royalty",
    "Don": "Royalty",
    "Sir" : "Royalty",
    "Dr": "Officer",
    "Rev": "Officer",
    "the Countess":"Royalty",
    "Mme": "Mrs",
    "Mlle": "Miss",
    "Ms": "Mrs",
    "Mr" : "Mr",
    "Mrs" : "Mrs",
    "Miss" : "Miss",
    "Master" : "Master",
    "Lady" : "Royalty"
}

# Apresenta o status do processamento
def status(feature):
    print('Processing', feature, ': ok')
    
# Separação dos tipos de embarque por coluna
def process_embarked(combined):
    # two missing embarked values - filling them with the most frequent one in the train  set(S)
    combined.Embarked.fillna('S', inplace=True)
    
    # dummy encoding 
    embarked_dummies = pd.get_dummies(combined['Embarked'], prefix='Embarked')
    combined = pd.concat([combined, embarked_dummies], axis=1)
    combined.drop('Embarked', axis=1, inplace=True)
    status('embarked')
    return combined

# Separação dos tipos de titulos por coluna
def process_names(combined):
    # encoding in dummy variable
    titles_dummies = pd.get_dummies(combined['Title'], prefix='Title')
    combined = pd.concat([combined, titles_dummies], axis=1)
    
    # removing the title variable
    combined.drop('Title', axis=1, inplace=True)    
    status('names')
    return combined

# Separação dos tipos de cabine por coluna
def process_cabin(combined):
    # replacing missing cabins with U (for Uknown)
    combined.Cabin.fillna('U', inplace=True)
    
    # mapping each Cabin value with the cabin letter
    combined['Cabin'] = combined['Cabin'].map(lambda c: c[0])
    
    # dummy encoding ...
    cabin_dummies = pd.get_dummies(combined['Cabin'], prefix='Cabin')    
    combined = pd.concat([combined, cabin_dummies], axis=1)

    combined.drop('Cabin', axis=1, inplace=True)
    status('cabin')
    return combined

# Separação dos tipos de classe por coluna
def process_pclass(combined):
    # encoding into 3 categories:
    pclass_dummies = pd.get_dummies(combined['Pclass'], prefix="Pclass")
    
    # adding dummy variable
    combined = pd.concat([combined, pclass_dummies], axis=1)
    
    # removing "Pclass"
    combined.drop('Pclass',axis=1,inplace=True)
    status('Pclass')
    return combined

# Separação dos tipos de classe por coluna
def process_family(combined):
    # introducing other features based on the family size
    combined['Family_Single'] = combined['FamilySize'].map(lambda s: 1 if s == 1 else 0)
    combined['Family_Small'] = combined['FamilySize'].map(lambda s: 1 if 2 <= s <= 3 else 0)
    combined['Family_Medium'] = combined['FamilySize'].map(lambda s: 1 if 3 <= s <= 6 else 0)
    combined['Family_Large'] = combined['FamilySize'].map(lambda s: 1 if 6 <= s else 0)    
    status('family')
    return combined

# Separando os títulos dos nomes
def getTitles(combined):
    # we extract the title from each name
    combined['Title'] = combined['Name'].map(lambda name:name.split(',')[1].split('.')[0].strip())
    
    # a map of more aggregated title
    # we map each title
    combined['Title'] = combined.Title.map(_title)
    status('Title')
    return combined