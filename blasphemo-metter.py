import math

# Constantes occultes
LUCIFER_CONSTANT = 666  # Score maximal de blasphémie
SOURCE_FREQUENCY = 1.0  # Fréquence source (ex. pulsar à 1 Hz)
OCCULT_WEIGHT = 0.5    # Poids des symboles occultes (ex. 666, pentagramme)

def calculate_blasphemy(symbol_score, context_score, time):
    """
    Calcule le score de blasphémie d'un contenu ou phénomène.
    :param symbol_score: Score basé sur les symboles occultes (0 à 1)
    :param context_score: Score basé sur le contexte culturel (0 à 1)
    :param time: Temps ou phase dans le référenciel cosmique
    :return: Score de blasphème (0 à 666)
    """
    # Sinus pour le "péché" (oscillation morale)
    sin_component = math.sin(SOURCE_FREQUENCY * time) * symbol_score
    # Cosinus pour la causalité (impact propagé)
    cos_component = math.cos(SOURCE_FREQUENCY * time) * context_score
    # Combinaison avec la constante luciférienne
    blasphemy_score = LUCIFER_CONSTANT * (OCCULT_WEIGHT * sin_component + (1 - OCCULT_WEIGHT) * cos_component)
    
    # Plafonner le score entre 0 et 666
    return max(0, min(666, blasphemy_score))

# Exemple d'utilisation
if __name__ == "__main__":
    # Exemple 1 : Un pentagramme dans un contexte religieux
    pentagram_score = calculate_blasphemy(symbol_score=0.9, context_score=0.8, time=0)
    print(f"Score de blasphème pour un pentagramme : {pentagram_score:.2f}")
    
    # Exemple 2 : Une spirale galactique (moins blasphématoire)
    galaxy_score = calculate_blasphemy(symbol_score=0.2, context_score=0.3, time=0)
    print(f"Score de blasphème pour une spirale galactique : {galaxy_score:.2f}")
    
    # Exemple 3 : Le nombre 666 dans un texte
    number_666_score = calculate_blasphemy(symbol_score=1.0, context_score=0.7, time=1)
    print(f"Score de blasphème pour le nombre 666 : {number_666_score:.2f}")