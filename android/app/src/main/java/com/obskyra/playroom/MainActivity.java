package com.obskyra.playroom;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.IOException;

public class MainActivity extends Activity {
    private WebView web;
    private static final String HOST = "app.playroom.local";
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(0xff121817);
        getWindow().setNavigationBarColor(0xff121817);
        web = new WebView(this);
        web.setBackgroundColor(0xff121817);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost())) return false;
                return true;
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!HOST.equals(uri.getHost())) return null;
                String path = uri.getPath();
                if (path == null || path.equals("/")) path = "/index.html";
                if (path.contains("..") || path.contains("\\")) return new WebResourceResponse("text/plain", "UTF-8", null);
                String mime = path.endsWith(".css") ? "text/css" : path.endsWith(".js") ? "application/javascript" : path.endsWith(".svg") ? "image/svg+xml" : path.endsWith(".jpg") ? "image/jpeg" : "text/html";
                try { return new WebResourceResponse(mime, "UTF-8", getAssets().open(path.substring(1))); }
                catch (IOException e) { return new WebResourceResponse("text/plain", "UTF-8", null); }
            }
        });
        setContentView(web);
        web.loadUrl("https://" + HOST + "/index.html");
    }
    @Override public void onBackPressed() {
        web.evaluateJavascript("(()=>{const d=document.querySelector('dialog[open]');if(d){d.close();return true}return false})()", value -> {
            if (!"true".equals(value)) finish();
        });
    }
    @Override protected void onDestroy() { if (web != null) web.destroy(); super.onDestroy(); }
}
