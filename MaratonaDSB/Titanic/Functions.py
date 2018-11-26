import matplotlib.pyplot as plt   

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
