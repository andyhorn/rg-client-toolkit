<template>
    <div id="help">
        <div class="row">
            <div class="col">
                <h4>Help</h4>
                <p>Use this tool to verify that you can reach the necessary ports on your licensing server.</p>
                <ol>
                    <li>Enter your server's IP address <em>or</em> Hostname
                    <li>Enter the TCP ports to test (see table below)</li>
                    <li>Click the "Scan" button</li>
                </ol>
                <p>A green cell means the test was successful.<br/>
                A red cell means your server was unavailable on that port.</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>TCP ports used by RLM</strong>
                <ul class="browser-default">
                    <li><strong>RLM Port:</strong> Used to initiate the connection to RLM (default is 5053)</li>
                    <li><strong>Web Port:</strong> Used to access the RLM administrative interface</li>
                    <li><strong>ISV Port:</strong> Red Giant products communicate over a separate (ISV) port</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PortScanHelp'
}
</script>

<style scoped>
    #help {
        padding-top: 2rem;
    }
</style>