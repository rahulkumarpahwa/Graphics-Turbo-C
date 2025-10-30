// Code Viewer - Show Turbo-C examples
document.addEventListener("DOMContentLoaded", () => {
  const codeDisplay = document.getElementById("tcCode");

  document.querySelectorAll(".show-code").forEach((btn) => {
    btn.addEventListener("click", () => {
      const which = btn.getAttribute("data-code");
      let code = "";

      if (which === "anim") {
        code = `#include <graphics.h>
#include <conio.h>

void drawDisk(int x, int y, int r, int color) {
    setfillstyle(SOLID_FILL, color);
    circle(x, y, r);
    floodfill(x, y, color);
}

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "");
    int x = 50, vx = 5;
    while(!kbhit()) {
        cleardevice();
        drawDisk(x, 100, 20, RED);
        delay(50);
        x += vx;
        if (x > getmaxx() - 20 || x < 20) vx = -vx;
    }
    closegraph();
    return 0;
}`;
      } else if (which === "save") {
        code = `#include <graphics.h>
#include <stdio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "");
    // draw sample scene
    setcolor(RED); 
    rectangle(20,20,100,70);
    setcolor(BLUE); 
    circle(200,50,30);

    // capture a region (pseudo)
    void *buf = malloc(getmaxx() * getmaxy());
    getimage(20,20,220,120, buf);
    
    // write buf to file (platform-specific)
    // FILE *f = fopen("image.bin","wb"); 
    // fwrite(buf, size, 1, f); 
    // fclose(f);

    // restore
    putimage(300,20, buf, COPY_PUT);

    getch();
    closegraph();
    return 0;
}`;
      } else if (which === "hanoi") {
        code = `#include <graphics.h>
#include <conio.h>

void drawPeg(int x) { 
    line(x, 50, x, 200); 
}

void drawDisk(int x, int y, int w, int color) { 
    setfillstyle(SOLID_FILL, color); 
    rectangle(x - w/2, y - w/4, x + w/2, y + w/4); 
    floodfill(x, y, color); 
}

void hanoi(int n, int from, int to, int aux) {
    if (n > 0) {
        hanoi(n - 1, from, aux, to);
        // move disk from->to
        // draw move (pseudo)
        hanoi(n - 1, aux, to, from);
    }
}

int main() { 
    int gd = DETECT, gm; 
    initgraph(&gd, &gm, "");
    // setup and call hanoi with draw calls
    getch(); 
    closegraph(); 
    return 0; 
}`;
      }

      if (codeDisplay) {
        codeDisplay.textContent = code;
      }
    });
  });
});
