package src.backend.Java;
import java.util.List;

/**
 * Classe de cartes à jouer
 */
public class cartes {

    //Nom de la carte
    private String nom;
    //Liste des cartes qui défende ou qui sont défendues par cette carte
    private List<cartes> opponents;


    public cartes(String nom, List<cartes> opponents) {
        this.nom = nom;
        this.opponents = opponents;
    }

    /**
     * Retrouve le nom de la carte
     * @return le nom de la carte
     */
    public String getNom() {
        return nom;
    }

    /**
     * Défini le nom de la carte
     * @param nom nom de la carte
     */
    public void setNom(String nom) {
        this.nom = nom;
    }

    /**
     * Retrouve la liste des cartes défendues ou qui défendent cette carte
     * @return la liste des cartes défendues ou qui défendent cette carte
     */
    public List<cartes> getOpponents() {
        return opponents;
    }

    /**
     * Défini les cartes défendues ou qui défendent cette carte
     * @param opponents liste des cartes défendues ou qui défendent cette carte
     */
    public void setOpponents(List<cartes> opponents) {
        this.opponents = opponents;
    }
}
