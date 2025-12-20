# projekt_wid_mario

Fokusfrage: Wann (Datum und Uhrzeit) laufen am Standort Bahnhofstrasse Nord am meisten erwachsene Personen gesamthaft durch (alle Richtungen)?

App Starten

Backend:
In GitBash console, ins backend Directory wechseln:

cd C:/Schule/S5/Webprog/projekt_wid_mario/backend
(oder äquivalentes lokales Directory)

Backend starrten:

uvicorn main:app --reload

Frontend:
In GitBash console, ins frontend Directory wechseln:

cd /c/Schule/S5/Webprog/projekt_wid_mario/frontend/wid-projekt-mario
(oder äquivalentes lokales Directory)

Frontend starten:

npm run dev

Wichtig!! Sicherstellen das die pfade mit forwardslash (/), und nicht mit backslash ( \ ) geschrieben werden!

Bei Problemen beim starten, gerne bei mir auf Teams oder unter mario.bay@students.fhnw.ch melden, ich bin die meiste Zeit während der ersten Januarwoche an der FHNW am lernen.

Aufbau Webaplikation
Fokusfrage: im oberen Teil der Web-App wird die Fokusfrage (siehe oben) beantwortet.

Im unteren Teil der Web-App können die User:innen die Daten erkundschaften. Mittls der Eingabe von Datum, Uhrzeit, Location und Typologie (Kinder/Erwachsene) kann für jeden vorhandenen Datenpunkt eine Antwort ausgegeben werden. Wählt man ein Datum, welches nicht im Zeitraum
(28.09.2021-30.07.2025) vorhanden ist, wird angegeben dass keine Daten verfügbar sind.
