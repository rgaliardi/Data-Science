## Classificador por Comparação

# Suprime erros
import warnings
warnings.filterwarnings('ignore')

import pandas as pd   
import seaborn as sns; sns.set(style="ticks", color_codes=True)

#Common Model Algorithms
from sklearn import svm, tree, linear_model, neighbors, naive_bayes, ensemble, discriminant_analysis, gaussian_process
from xgboost import XGBClassifier

#Metrics
from sklearn.metrics import accuracy_score, log_loss

#Splits
from sklearn.model_selection import KFold, ShuffleSplit, StratifiedShuffleSplit, StratifiedKFold

# Comparação dos classificadores
classifiers = [
    #Ensemble Methods
    ensemble.AdaBoostClassifier(),
    ensemble.BaggingClassifier(),
    ensemble.ExtraTreesClassifier(),
    ensemble.GradientBoostingClassifier(),
    ensemble.RandomForestClassifier(),

    #Gaussian Processes
    gaussian_process.GaussianProcessClassifier(),
    
    #GLM
    linear_model.LogisticRegressionCV(),
    linear_model.PassiveAggressiveClassifier(),
    linear_model.RidgeClassifierCV(),
    linear_model.SGDClassifier(),
    linear_model.Perceptron(),
    
    #Navies Bayes
    naive_bayes.BernoulliNB(),
    naive_bayes.GaussianNB(),
    
    #Nearest Neighbor
    neighbors.KNeighborsClassifier(),
    
    #SVM
    svm.SVC(probability=True),
    svm.NuSVC(probability=True),
    svm.LinearSVC(),
    
    #Trees    
    tree.DecisionTreeClassifier(),
    tree.ExtraTreeClassifier(),
    
    #Discriminant Analysis
    discriminant_analysis.LinearDiscriminantAnalysis(),
    discriminant_analysis.QuadraticDiscriminantAnalysis(),

    #xgboost: http://xgboost.readthedocs.io/en/latest/model.html
    XGBClassifier()    
    ]

def Classifier(splits, target, features):
    cols = ["Classifier", "Accuracy"]
    acc_dict = {}
    log = pd.DataFrame(columns=cols)

    X = features.values
    y = target.values

    #_split = KFold(n_splits=splits, random_state=42, shuffle=True)
    #_split = model_selection.ShuffleSplit(n_splits = splits, test_size = .3, train_size = .6, random_state = 0 )
    _split = StratifiedShuffleSplit(n_splits= splits, test_size=0.1, random_state=0)

    for train_index, test_index in _split.split(X, y):
        X_train, X_test = X[train_index], X[test_index]
        y_train, y_test = y[train_index], y[test_index]

        for clf in classifiers:
            name = clf.__class__.__name__
            clf.fit(X_train, y_train)
            predictions = clf.predict(X_test)
            acc = accuracy_score(y_test, predictions)
            if name in acc_dict:
                acc_dict[name] += acc
            else:
                acc_dict[name] = acc
                
    for clf in acc_dict:
        acc_dict[clf] = acc_dict[clf] / 10.0
        log_entry = pd.DataFrame([[clf, acc_dict[clf]]], columns=cols)
        log = log.append(log_entry)
    
    # Plot Classifier Accuracy
    sns.set(style="darkgrid")
    sns.barplot(x='Accuracy', y='Classifier', data=log)
    
    return log.groupby(['Classifier', 'Accuracy']).count().sort_values(by=['Accuracy'], ascending=False)

def Prediction(classifier, target, features, test):
    candidate_classifier = classifier
    candidate_classifier.fit(features, target)
    result = candidate_classifier.predict(test)
    return result