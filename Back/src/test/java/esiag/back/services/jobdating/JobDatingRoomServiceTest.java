package esiag.back.services.jobdating;

import junit.framework.TestCase;
// https://www.jmdoudoux.fr/java/dej/chap-junit.htm
// un test hérite de la classe TestCase
public class JobDatingRoomServiceTest extends TestCase {

    // il faut que le nom commence par test
    public void testCalculerScoreBruit() {
        JobDatingRoomService service = new JobDatingRoomService();
        
        // on vérifie les règles de score pour le bruit
        assertEquals(10, service.calculerScoreBruit(60.0));
        assertEquals(4, service.calculerScoreBruit(70.0));
        assertEquals(0, service.calculerScoreBruit(80.0));
    }
}